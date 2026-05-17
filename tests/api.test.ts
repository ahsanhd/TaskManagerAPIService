import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./test.db";
process.env.JWT_SECRET = "test-secret-key";

let app: typeof import("../app/src/app.js").default;
let prisma: typeof import("../app/src/config/db.js").prisma;

beforeAll(async () => {
  execSync("npm run db:push", {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
    shell: true,
  });

  const appModule = await import("../app/src/app.js");
  const dbModule = await import("../app/src/config/db.js");

  app = appModule.default;
  prisma = dbModule.prisma;

  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Task Management API", () => {
  it("rejects invalid signup payloads", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "A",
      email: "not-an-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Name must be at least 2 characters long");
  });

  it("rejects duplicate signup emails", async () => {
    const firstResponse = await request(app).post("/api/auth/signup").send({
      name: "Duplicate User",
      email: "duplicate@example.com",
      password: "Password123!",
    });

    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await request(app).post("/api/auth/signup").send({
      name: "Duplicate User 2",
      email: "duplicate@example.com",
      password: "Password123!",
    });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toBe("A user with this email already exists");
  });

  it("signs up, logs in, and returns tokens", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
    });

    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body.token).toBeTypeOf("string");
    expect(signupResponse.body.user.password).toBeUndefined();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password123!",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTypeOf("string");
  });

  it("rejects task routes without a token", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Missing or invalid authorization token");
  });

  it("rejects malformed auth tokens", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set({ Authorization: "Bearer not-a-real-token" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired authorization token");
  });

  it("enforces task ownership and CRUD rules", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Owner User",
      email: "owner@example.com",
      password: "Password123!",
    });

    const authHeaders = {
      Authorization: `Bearer ${signupResponse.body.token}`,
    };

    const createResponse = await request(app)
      .post("/api/tasks")
      .set(authHeaders)
      .send({
        title: "First task",
        description: "Owner task",
        status: "IN_PROGRESS",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.task.title).toBe("First task");
    expect(createResponse.body.task.status).toBe("IN_PROGRESS");

    const listResponse = await request(app).get("/api/tasks").set(authHeaders);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.tasks).toHaveLength(1);

    const taskId = createResponse.body.task.id;

    const readResponse = await request(app).get(`/api/tasks/${taskId}`).set(authHeaders);
    expect(readResponse.status).toBe(200);
    expect(readResponse.body.task.id).toBe(taskId);

    const updateResponse = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set(authHeaders)
      .send({ title: "Updated task", status: "COMPLETED" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.task.title).toBe("Updated task");
    expect(updateResponse.body.task.status).toBe("COMPLETED");

    const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`).set(authHeaders);
    expect(deleteResponse.status).toBe(204);

    const secondUserSignup = await request(app).post("/api/auth/signup").send({
      name: "Second User",
      email: "second@example.com",
      password: "Password123!",
    });

    const secondUserHeaders = {
      Authorization: `Bearer ${secondUserSignup.body.token}`,
    };

    const forbiddenRead = await request(app).get(`/api/tasks/${taskId}`).set(secondUserHeaders);
    expect(forbiddenRead.status).toBe(404);
    expect(forbiddenRead.body.message).toBe("Task not found");
  });

  it("rejects invalid task payloads", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Validator",
      email: "validator@example.com",
      password: "Password123!",
    });

    const authHeaders = {
      Authorization: `Bearer ${signupResponse.body.token}`,
    };

    const response = await request(app).post("/api/tasks").set(authHeaders).send({
      title: "x".repeat(121),
      description: "   ",
      status: "INVALID",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title must not exceed 120 characters");
  });

  it("rejects empty task titles", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Title Validator",
      email: "titlevalidator@example.com",
      password: "Password123!",
    });

    const authHeaders = {
      Authorization: `Bearer ${signupResponse.body.token}`,
    };

    const response = await request(app).post("/api/tasks").set(authHeaders).send({
      title: "   ",
      description: "Empty title should fail",
      status: "PENDING",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title is required");
  });

  it("rejects invalid task dates", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Date Validator",
      email: "datevalidator@example.com",
      password: "Password123!",
    });

    const authHeaders = {
      Authorization: `Bearer ${signupResponse.body.token}`,
    };

    const response = await request(app).post("/api/tasks").set(authHeaders).send({
      title: "Date task",
      description: "Testing an invalid date",
      dueDate: "not-a-real-date",
      status: "PENDING",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Due date must be a valid date string");
  });

  it("rejects task writes from other users", async () => {
    const firstUserSignup = await request(app).post("/api/auth/signup").send({
      name: "Owner One",
      email: "ownerone@example.com",
      password: "Password123!",
    });

    const firstUserHeaders = {
      Authorization: `Bearer ${firstUserSignup.body.token}`,
    };

    const taskResponse = await request(app).post("/api/tasks").set(firstUserHeaders).send({
      title: "Protected task",
      description: "Only owner should touch this",
      status: "PENDING",
    });

    const secondUserSignup = await request(app).post("/api/auth/signup").send({
      name: "Owner Two",
      email: "ownertwo@example.com",
      password: "Password123!",
    });

    const secondUserHeaders = {
      Authorization: `Bearer ${secondUserSignup.body.token}`,
    };

    const updateResponse = await request(app)
      .patch(`/api/tasks/${taskResponse.body.task.id}`)
      .set(secondUserHeaders)
      .send({ title: "Hacked title" });

    expect(updateResponse.status).toBe(404);
    expect(updateResponse.body.message).toBe("Task not found");

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskResponse.body.task.id}`)
      .set(secondUserHeaders);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.message).toBe("Task not found");
  });
});
