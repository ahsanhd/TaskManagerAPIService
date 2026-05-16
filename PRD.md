# Task Management API PRD

## Overview

A REST API for managing personal tasks. Each user can sign up, log in, and manage only their own tasks. The API is meant for learning, but the structure should follow real-world backend practices.

## Product Goal

Build a secure, clean, and maintainable backend service that lets users:

- create accounts
- log in with JWT
- create, read, update, and delete tasks
- access only their own task data

## What the API Will Do

The API will act as the backend for a task manager app. It will:

- authenticate users with signup and login
- issue JWT tokens after successful login
- store users and tasks in MongoDB
- protect task routes so only authenticated users can use them
- ensure each user can only see and change their own tasks
- validate incoming data and return helpful errors

## Core Features

### Authentication

- User signup
- User login
- Password hashing
- JWT token generation
- Protected routes using auth middleware

### Tasks

- Create a task
- Get all tasks for the logged-in user
- Get one task by id
- Update a task
- Delete a task
- Restrict access to the task owner only

### Validation and Errors

- Validate required fields
- Return clear 400/401/403/404 responses
- Centralized error handling

## Data Model Summary

### User

- name
- email
- password
- timestamps

### Task

- title
- description
- status
- dueDate
- user reference
- timestamps

## Scope for Version 1

In the first version, the API should support:

- user registration and login
- JWT authentication
- task CRUD
- ownership checks
- basic validation and error handling

## Non-Goals for Version 1

Not needed yet:

- frontend UI
- task sharing between users
- admin dashboard
- comments or attachments
- notifications
- recurring tasks

## Success Criteria

The project is successful if:

- a user can register and log in
- a valid token is required for task routes
- one user cannot read or edit another user's tasks
- invalid requests return useful errors
- the code is organized and easy to extend

## Suggested Learning Path

1. Project setup and server bootstrap
2. MongoDB connection and environment config
3. User and task models
4. Auth routes and JWT
5. Protected task routes
6. Validation and error handling
7. Testing and polish

## Notes

This API should be built as if it were a small production backend, not just a demo. The main learning goal is to understand how authentication, authorization, validation, and data modeling fit together in a real Node.js backend.
