# Task Manager Mini Project

## Description

Task Manager is a full-stack application (frontend + backend) that allows users to manage their personal tasks.
Each user can create, read, update, archive, toggle, and delete their tasks.
The app ensures security using JWT authentication and comes with unit and integration tests for both backend modules.

---

## Technologies

**Backend:**

* NestJS (Node.js)
* TypeORM
* PostgreSQL
* JWT for authentication
* ValidationPipe for DTO validation
* Jest + Supertest for unit and integration tests

**Frontend:**

* React.js
* Axios for HTTP requests
* TailwindCSS 

**DevOps / Containerization:**

* Docker
* Docker Compose (development & production)
* MinIO (optional for file storage)

---

## Features

### Authentication

* Sign up (`/auth/signup`)
* Sign in (`/auth/signin`) with JWT generation
* Each user can only access their own data using `AuthGuard` and the `@GetUser()` decorator

### Task Management

* Create task (`POST /tasks`)
* Get all tasks (`GET /tasks`)
* Get a task by ID (`GET /tasks/:id`)
* Update task (`PUT /tasks/:id`)
* Archive task (`PATCH /tasks/:id/archive`)
* Toggle active status (`PATCH /tasks/:id/toggle`)
* Delete task (`DELETE /tasks/:id`)

---

## Backend Structure

```
src/
├─ auth/
│  ├─ auth.controller.ts
│  ├─ auth.service.ts
│  ├─ entities/user.entity.ts
│  ├─ dto/auth-credentials.dto.ts
|  |-get-user.decorator.ts
|  |-users.repository.ts
│  └─ starategies
|            |-jwt.strategy.ts
|            |-jwt-payload.interface.ts
├─ task/
│  ├─ task.controller.ts
│  ├─ task.service.ts
│  ├─ entities/task.entity.ts
│  └─ dto/create-task.dto.ts / update-task.dto.ts
├─ main.ts
├─app.module.ts
```

---

## Tests

**Backend Tests:**

* **Unit tests:** AuthService and TaskService
* **Integration tests:** AuthController
* Tests cover:

  * Auth: signup, signin, JWT validation
  * Task: CRUD operations, archive, toggle, and user-specific access

---

## Database

* PostgreSQL (development & production)
* Users can only access their own tasks
* Docker Compose manages the database container

---

## Docker

**Backend Dockerfile:**

* Builds the NestJS app
* Exposes port 3001

**Frontend Dockerfile:**

* Builds the React app
* Exposes port 3000

**Docker Compose:**

* **dev:** for local development with hot reload
* **prod:** production-ready with persistent DB

---

## Installation

### 1. Clone the project

```bash
git clone <repo_url>
cd task-manager
```

### 2. Backend

```bash
cd task-manager-backend
npm install
```

### 3. Frontend

```bash
cd task-manager-frontend
npm install
```

### 4. Run with Docker Compose (prod)

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### 5. Run backend tests

```bash
npm run test        # unit tests
npm run test:e2e    # integration tests
```

### 6. Access the application

* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:3001`

---

## Best Practices

* Each test uses an **isolated database** (SQLite in-memory or Postgres test DB) to avoid affecting the main database.
* All `/tasks` endpoints are **JWT-protected**.
* The `@GetUser()` decorator ensures each user only sees their own tasks.
* Docker Compose simplifies development and production setups without environment conflicts.

