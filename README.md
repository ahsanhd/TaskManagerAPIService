# Task Management API

A learning-focused backend project built with Node.js, Express, and MongoDB.

This API is designed to behave like a real task management backend: users can sign up, log in, get a JWT token, and manage only their own tasks.

## What This Project Will Do

The API will:
- let users register and log in
- issue JWT tokens after login
- store users and tasks in MongoDB
- protect task routes so only authenticated users can access them
- ensure each user can only see and change their own tasks
- validate incoming data and return useful errors

## Product Goal

The goal is to build a secure, clean, and maintainable backend service that demonstrates real-world backend patterns:
- authentication
- authorization
- validation
- error handling
- modular folder structure
- MongoDB data modeling

## Current Status

The project is in the foundation phase.

Completed so far:
- Node.js project setup
- Express server bootstrap
- TypeScript runtime setup with `tsx`
- MongoDB connection helper
- basic folder structure
- project PRD
- backend design document
- environment example file

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript
- dotenv
- tsx

## Folder Structure

```text
app/
  src/
    app.ts
    server.ts
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
```

### What each part does

- `app/src/app.ts` creates and configures the Express app.
- `app/src/server.ts` loads environment variables, connects to MongoDB, and starts the server.
- `app/src/config/` will contain setup code for services like MongoDB.
- `app/src/controllers/` will hold route logic.
- `app/src/middlewares/` will hold auth, validation, and error middleware.
- `app/src/models/` will hold MongoDB schemas and models.
- `app/src/routes/` will map URLs to controllers.
- `app/src/utils/` will hold reusable helper functions.

## API Scope for Version 1

Version 1 will include:
- user signup
- user login
- JWT authentication
- task CRUD
- ownership checks so users only access their own tasks
- validation and helpful error responses

Not included yet:
- frontend UI
- task sharing
- notifications
- recurring tasks
- admin features
- comments or attachments

## Planned Data Models

### User
A user document will contain:
- name
- email
- password
- timestamps

### Task
A task document will contain:
- title
- description
- status
- dueDate
- user reference
- timestamps

## Planned Routes

### Auth routes
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Task routes
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Environment Variables

Create a `.env` file in the project root based on `.env.example`.

Required values:
- `PORT` - the port the server should run on
- `MONGO_URI` - MongoDB connection string

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanagementapi
```

## Scripts

- `npm run start` - start the server
- `npm run dev` - start the server with watch mode
- `npm test` - placeholder test script for now

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file from `.env.example`

3. Make sure MongoDB is running locally or update `MONGO_URI` to point to your database

4. Start the development server

```bash
npm run dev
```

## Request Flow

A request will move through the system like this:

1. The client sends a request.
2. Express receives it.
3. Middleware runs.
4. If the route is protected, auth middleware checks the JWT.
5. The controller handles the request.
6. The controller talks to the model.
7. MongoDB reads or writes data.
8. The API sends a response.
9. If something fails, error middleware formats the error response.

## Important Rule

Each user can only access their own tasks.

That means one user must not be able to read, update, or delete another user's tasks.

This is one of the core security rules of the project.

## Learning Roadmap

1. Project setup and server bootstrap
2. MongoDB connection and environment config
3. User and task models
4. Authentication routes and JWT
5. Protected task routes
6. Validation and error handling
7. Testing and polish

## Design Documents

- [PRD](PRD.md)
- [Backend Design](DESIGN.md)

## Why This Project Exists

This project is for learning how a real backend works.
It is meant to teach how authentication, authorization, validation, routing, and data modeling fit together in a maintainable Node.js service.
