# Task Management API Design

## What We Are Building

We are building a backend API for a task manager.

A user will be able to:

- create an account
- log in
- receive a JWT token
- create tasks
- view only their own tasks
- update their own tasks
- delete their own tasks

This API does not show a UI. It only provides data and rules for a frontend or mobile app to use later.

## Why This Design Matters

If we build the API without a clear design, the code becomes hard to understand and hard to extend.

This design gives us:

- a clear folder structure
- a clear data model
- a clear route structure
- a clear request flow
- a clear separation of responsibilities

That is how real backend projects stay maintainable.

## Main Parts of the API

### 1. Express server

This is the part that receives HTTP requests.
It listens for routes like `POST /api/auth/login` or `GET /api/tasks`.

### 2. MongoDB database

This is where we store users and tasks.
MongoDB is a document database, so data is saved as flexible JSON-like documents.

### 3. Authentication

Authentication answers the question: "Who is the user?"

We will use:

- password hashing so passwords are not stored in plain text
- JWT so the user can stay logged in across requests

### 4. Authorization

Authorization answers the question: "What is this user allowed to do?"

For this project, the rule is simple:

- a user can only access their own tasks

### 5. Validation

Validation checks whether the request data is correct before saving it.
For example:

- email must look like an email
- password must not be empty
- task title must be present

### 6. Error handling

When something goes wrong, we return a clear response instead of crashing.
Examples:

- 400 for bad input
- 401 for unauthenticated requests
- 403 for forbidden access
- 404 for missing resources
- 500 for unexpected server errors

## Folder Structure Plan

We already have the main backend folders. This is what each one will do.

### `app/src/app.ts`

Creates and configures the Express app.
It will hold shared middleware and route registration.

### `app/src/server.ts`

Starts the application.
It loads environment variables, connects to MongoDB, and begins listening on the port.

### `app/src/config/`

Holds setup code for outside services.
Right now this will include the MongoDB connection file.

### `app/src/models/`

Holds MongoDB schemas and models.
These define the structure of users and tasks.

### `app/src/controllers/`

Holds route logic.
Controllers decide what happens when a request comes in.

### `app/src/routes/`

Holds route definitions.
Routes connect URLs to controllers.

### `app/src/middlewares/`

Holds middleware such as authentication, validation, and error handling.

### `app/src/utils/`

Holds reusable helper functions.
Examples could include token helpers or small shared utilities.

## Data Models

### User model

A user needs these fields:

- `name`
- `email`
- `password`
- timestamps

Why:

- `name` helps identify the user
- `email` is used for login
- `password` is required for authentication
- timestamps help us know when the account was created or updated

Important rule:

- the password must be hashed before saving

### Task model

A task needs these fields:

- `title`
- `description`
- `status`
- `dueDate`
- `user`
- timestamps

Why:

- `title` is the main task name
- `description` gives extra details
- `status` shows progress, such as pending or completed
- `dueDate` helps with deadlines
- `user` links the task to its owner

Important rule:

- every task must belong to one user

## Route Plan

### Auth routes

These routes handle signup and login.

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Task routes

These routes handle CRUD for tasks.

- `GET /api/tasks` - get all tasks for the logged-in user
- `POST /api/tasks` - create a new task
- `GET /api/tasks/:id` - get one task by id
- `PATCH /api/tasks/:id` - update a task
- `DELETE /api/tasks/:id` - delete a task

## Request Flow

Here is the path a request will follow:

1. The client sends a request.
2. Express receives it.
3. Middleware runs first.
4. If the route is protected, auth middleware checks the JWT token.
5. The controller handles the request.
6. The controller talks to the model.
7. MongoDB reads or writes the data.
8. The API sends a response back.
9. If an error happens, error middleware formats the response.

This flow is important because it keeps the code organized and predictable.

## Task Ownership Rule

This is one of the most important rules in the whole project.

When a user requests a task, we must always check that the task belongs to that user.

That means:

- user A cannot read user B's task
- user A cannot edit user B's task
- user A cannot delete user B's task

We will enforce this by storing the logged-in user's id in the JWT and linking each task to a user id in MongoDB.

## Suggested First Version Behavior

For version 1, the API should do only these things well:

- create a user account
- log in a user
- protect task routes with JWT
- create tasks for the logged-in user
- list only that user's tasks
- update and delete only that user's tasks
- validate input and return useful errors

## What We Are Not Building Yet

To stay focused, we will not add these in version 1:

- frontend interface
- task comments
- file uploads
- sharing tasks with other users
- notifications
- recurring tasks
- admin features

## Build Order

This is the safest order to build the project.

1. Finalize the design and folder structure
2. Create the User and Task models
3. Add authentication routes
4. Add JWT auth middleware
5. Add task CRUD routes
6. Add validation and error handling
7. Test the API and improve it

## Learning Goal

The point of this project is not just to finish an app.
The point is to understand how a real backend works:

- how data is modeled
- how login systems work
- how security rules are enforced
- how requests move through controllers and middleware
- how to keep code maintainable as the project grows
