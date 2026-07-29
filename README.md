# Electro-Pi API — Comprehensive Project Documentation

> **Version:** `0.0.1`  
> **License:** UNLICENSED (Private)  
> **Last Updated:** 2026-07-29

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Design Philosophy](#3-architecture--design-philosophy)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Core Layer (`src/core`)](#5-core-layer-srccore)
6. [Common Layer (`src/common`)](#6-common-layer-srccommon)
7. [Infrastructure Layer (`src/infrastructure`)](#7-infrastructure-layer-srcinfrastructure)
8. [Business Modules (`src/modules`)](#8-business-modules-srcmodules)
9. [API Routing & Endpoints](#9-api-routing--endpoints)
10. [Configuration & Environment](#10-configuration--environment)
11. [Authentication & Authorization](#11-authentication--authorization)
12. [Database Schema](#12-database-schema)
13. [File Storage (S3)](#13-file-storage-s3)
14. [Error Handling](#14-error-handling)
15. [Rate Limiting & Security](#15-rate-limiting--security)
16. [Swagger API Documentation](#16-swagger-api-documentation)
17. [DevOps & Deployment](#17-devops--deployment)
18. [Quick Reference — All Environment Variables](#18-quick-reference--all-environment-variables)

---

## 1. Project Overview

**Electro-Pi** is a project management and collaboration platform. This repository (`electro-pi-api`) is the **backend API** that powers the entire Electro-Pi ecosystem.

### Core Purpose

- Provide a secure, scalable REST API for team project management.
- Manage user identities, authentication, and role-based authorization (admin/member).
- Serve as the central hub for projects, tasks, and file management.
- Store and serve user-uploaded content (project covers, task images) via AWS S3 with local disk fallback.

### Key Design Goals

- **Modular Architecture**: clear separation of concerns — each feature module owns its full vertical slice (entity, repository, service, controller).
- **Infrastructure Abstraction**: technical adapters (database, JWT, S3 upload, password hashing) are isolated in the infrastructure layer.
- **Production-Ready**: structured logging, rate limiting, global error handling, helmet security headers, and environment-based configuration.
- **Docker-First**: multi-stage Dockerfile and docker-compose with PostgreSQL and Redis for seamless local and production deployment.

---

## 2. Technology Stack

### Runtime & Language

| Category        | Technology | Version |
| --------------- | ---------- | ------- |
| Runtime         | Node.js    | 22.x    |
| Language        | TypeScript | 5.7.3   |
| Framework       | NestJS     | 11.x    |
| Package Manager | npm        | —       |

### Core Framework Dependencies

| Package                    | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `@nestjs/core`             | NestJS runtime core                     |
| `@nestjs/common`           | Decorators, pipes, guards, interceptors |
| `@nestjs/config`           | Environment-based configuration         |
| `@nestjs/platform-express` | HTTP server (Express adapter)           |
| `@nestjs/swagger`          | OpenAPI / Swagger documentation         |
| `@nestjs/throttler`        | Rate limiting                           |
| `@nestjs/schedule`         | Cron job scheduling                     |
| `@nestjs/jwt`              | JWT token generation & verification     |
| `@nestjs/typeorm`          | TypeORM integration for NestJS          |

### Database & Caching

| Package   | Purpose                       |
| --------- | ----------------------------- |
| `typeorm` | ORM for database operations   |
| `pg`      | PostgreSQL driver             |

### Security

| Package       | Purpose                 |
| ------------- | ----------------------- |
| `bcrypt`      | Password hashing        |
| `passport`    | Authentication framework |
| `passport-jwt`| JWT strategy            |
| `helmet`      | HTTP security headers   |
| `cookie-parser`| Cookie parsing         |

### Storage & Cloud

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `@aws-sdk/client-s3` | AWS S3 client SDK          |
| `@aws-sdk/lib-storage`| Multipart S3 uploads       |

### Upload

| Package | Purpose               |
| ------- | --------------------- |
| `multer` | File upload handling  |

### Validation & Transformation

| Package             | Purpose                       |
| ------------------- | ----------------------------- |
| `class-validator`   | DTO validation decorators     |
| `class-transformer` | Plain-to-class transformation |

### Development Tools

| Package       | Purpose                     |
| ------------- | --------------------------- |
| `@nestjs/cli` | NestJS project scaffolding  |
| `@swc/core`   | Fast TypeScript compilation |
| `eslint` (9.x)| Linting (flat config)       |
| `prettier`    | Code formatting             |
| `jest`        | Test runner                 |
| `ts-jest`     | TypeScript transform for Jest|
| `supertest`   | HTTP assertion for e2e tests|

---

## 3. Architecture & Design Philosophy

### Layered Modular Monolith

The codebase follows a **layered modular monolith** pattern. Each layer has a specific responsibility.

```
                     ┌──────────────────────────┐
                     │       src/main.ts        │  ← Entry point
                     └────────────┬─────────────┘
                                  │
                     ┌────────────▼─────────────┐
                     │   src/app.module.ts      │  ← Root module
                     └────────────┬─────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
    ┌──────▼──────┐     ┌────────▼────────┐     ┌───────▼───────┐
    │    core/    │     │ infrastructure/ │     │   modules/    │
    │  (config,   │     │  (technical     │     │  (business    │
    │  bootstrap, │     │   adapters)     │     │   features)   │
    │  swagger)   │     │                 │     │               │
    └──────┬──────┘     └────────┬────────┘     └───────┬───────┘
           │                      │                      │
    ┌──────▼──────┐              │              ┌───────▼───────┐
    │   common/   │              │              │   shared/     │
    │ (reusable   │◄─────────────┼──────────────► (cross-       │
    │  artifacts) │              │              │  module)      │
    └─────────────┘              │              └───────────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
        ┌──────▼──────┐  ┌──────▼──────┐  ┌───────▼──────┐
        │  PostgreSQL  │  │    Redis    │  │   AWS S3     │
        │  (TypeORM)   │  │             │  │  (+ local)   │
        └─────────────┘  └─────────────┘  └──────────────┘
```

### Module Internal Structure

Each feature module inside `src/modules/` follows a flat structure:

```
modules/<feature>/
  ├── constants/       # Feature-specific constants & enums
  ├── controller/      # HTTP controllers (admin + member)
  ├── dto/             # Data transfer objects / validation
  ├── entity/          # TypeORM entities
  ├── repo/            # Repository pattern wrappers
  ├── services/        # Business logic services
  └── <feature>.module.ts
```

### Key Architectural Principles

1. **Separation of Concerns**: Infrastructure adapters (S3, JWT, bcrypt) are isolated from business logic. A business module never imports an S3 client directly.

2. **Global-by-Default for Cross-Cutting Concerns**: `CoreModule` registers global filters, guards, and pipes so every module gets them automatically.

3. **Role-Based Access Control**: `@Roles('admin')` + `RolesGuard` on controllers; `@Protected()` marks routes requiring authentication; `@Public()` allows unauthenticated access.

4. **Fail-Fast on Configuration**: JWT secrets are validated at startup; dev-only fallbacks prevent accidental production deployment.

5. **Dual Controller Pattern**: Admin controllers (`/projects`, `/tasks`) handle write operations; member controllers (`/members`, `/members/tasks`) handle read and self-service operations — clean separation of admin vs. member concerns.

---

## 4. Complete Folder Structure

```
electro-pi-api/
│
├── docker-compose.yml             # PostgreSQL + Redis + API
├── Dockerfile                     # Multi-stage (node:22-alpine)
├── .dockerignore
│
├── src/                           # █████████ SOURCE CODE █████████
│   │
│   ├── main.ts                    # Entry point (bootstrap + static assets)
│   ├── app.module.ts              # Root NestJS module
│   │
│   ├── core/                      # ── CORE LAYER ──
│   │   ├── core.module.ts         # Config, throttler, routing
│   │   ├── index.ts
│   │   ├── bootstrap/
│   │   │   └── app.bootstrap.ts   # Helmet, CORS, validation pipe, versioning
│   │   ├── swagger/
│   │   │   └── swagger.config.ts  # Swagger/OpenAPI + dark theme
│   │   └── utils/
│   │       └── env.utils.ts       # toNumber, toBoolean helpers
│   │
│   ├── common/                    # ── COMMON LAYER ──
│   │   ├── common.module.ts
│   │   ├── index.ts               # Barrel exports
│   │   ├── constants/
│   │   │   └── roles.constants.ts # UserRoles: admin | member
│   │   ├── decorators/
│   │   │   ├── protected.decorator.ts  # @Protected()
│   │   │   ├── public.decorator.ts     # @Public()
│   │   │   └── roles.decorator.ts      # @Roles(...)
│   │   ├── enums/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception filter
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # JWT token verification
│   │   │   └── roles.guard.ts     # Role-based access control
│   │   ├── interceptors/
│   │   │   └── transform-response.interceptor.ts
│   │   ├── interfaces/
│   │   │   └── authenticated-user.interface.ts
│   │   └── types/
│   │       └── express.d.ts       # Express Request augmentation
│   │
│   ├── infrastructure/            # ── INFRASTRUCTURE LAYER ──
│   │   ├── infrastructure.module.ts
│   │   ├── index.ts
│   │   │
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── services/
│   │   │       └── database.service.ts
│   │   │
│   │   ├── jwt/
│   │   │   ├── jwt.module.ts
│   │   │   ├── config/
│   │   │   │   └── jwt.config.ts
│   │   │   ├── constants/
│   │   │   │   └── jwt.constants.ts
│   │   │   ├── services/
│   │   │   │   └── token.service.ts
│   │   │   └── types/
│   │   │       ├── jwt-config.type.ts
│   │   │       ├── jwt-payload.type.ts
│   │   │       ├── jwt-token-type.type.ts
│   │   │       └── token-pair.type.ts
│   │   │
│   │   ├── password/
│   │   │   ├── password.module.ts
│   │   │   ├── constants/
│   │   │   │   └── password.constants.ts
│   │   │   └── services/
│   │   │       └── password.service.ts
│   │   │
│   │   └── upload/
│   │       ├── upload.module.ts
│   │       └── services/
│   │           └── uploader.service.ts
│   │
│   └── modules/                   # ── BUSINESS MODULES ──
│       ├── modules.module.ts      # Aggregates all feature modules
│       │
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── controllers/
│       │   │   └── auth.controller.ts
│       │   ├── dto/
│       │   │   ├── index.ts
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── services/
│       │   │   └── auth.service.ts
│       │   └── types/
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── controller/
│       │   │   ├── user.controller.ts      # Admin user management
│       │   │   └── members.controller.ts   # Profile + profile image
│       │   ├── dto/
│       │   │   ├── create-user.dto.ts
│       │   │   └── index.ts
│       │   ├── entity/
│       │   │   └── user.entity.ts
│       │   ├── repository/
│       │   │   └── user.repo.ts
│       │   └── services/
│       │       └── user.service.ts
│       │
│       ├── projects/
│       │   ├── projects.module.ts
│       │   ├── constants/
│       │   │   └── projects.cons.ts
│       │   ├── controller/
│       │   │   ├── projects.controller.ts         # Admin CRUD
│       │   │   └── projects-members.controller.ts # Member reads
│       │   ├── dto/
│       │   │   └── create-project.dto.ts
│       │   ├── entity/
│       │   │   └── project.entity.ts
│       │   ├── repo/
│       │   │   └── project.repo.ts
│       │   └── services/
│       │       └── projects.service.ts
│       │
│       ├── tasks/
│       │   ├── tasks.module.ts
│       │   ├── constants/
│       │   │   └── taskst.const.ts
│       │   ├── controller/
│       │   │   ├── tasks.controller.ts            # Admin CRUD
│       │   │   └── tasks-members.controller.ts    # Member reads + status
│       │   ├── dto/
│       │   │   ├── create-task.dto.ts
│       │   │   ├── update-task.dto.ts
│       │   │   └── update-task-status.dto.ts
│       │   ├── entity/
│       │   │   ├── task.entity.ts
│       │   │   └── task-image.entity.ts
│       │   ├── repo/
│       │   │   └── task.repo.ts
│       │   └── services/
│       │       └── tasks.service.ts
│       │
│       └── notifications/         # Stub — reserved for future
│           └── notifications.module.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── uploads/                       # Local disk fallback for file uploads
│
├── .env                           # Environment variables
├── .env.example
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 5. Core Layer (`src/core`)

The **Core Layer** provides process-wide, cross-cutting configuration.

### 5.1 `CoreModule` (`core.module.ts`)

#### ConfigModule
- **Global**: Available to all modules without importing.
- **Cached**: Prevents repeated file reads.
- **Environment File**: Loads from `.env`.

#### ThrottlerModule
Three named rate limiters:

| Name      | Window   | Limit | Use Case               |
| --------- | -------- | ----- | ---------------------- |
| `default` | 1 min    | 60    | General API requests   |
| `strict`  | 1 min    | 10    | Sensitive endpoints    |
| `auth`    | 15 min   | 35    | Login / register       |

#### Global Providers

| Provider              | Scope        | Purpose                            |
| --------------------- | ------------ | ---------------------------------- |
| `AllExceptionsFilter` | `APP_FILTER` | Catches every unhandled exception  |
| `ThrottlerGuard`      | `APP_GUARD`  | Enforces rate limits on all routes |

### 5.2 Bootstrap Helpers (`bootstrap/app.bootstrap.ts`)

`configureApplication(app)` applies:

| Setting                 | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| `enableShutdownHooks()` | Graceful shutdown on SIGTERM/SIGINT                            |
| `helmet()`              | CSP disabled (for Swagger)                                     |
| `cookieParser()`        | Parse cookies for auth flows                                   |
| `enableCors()`          | `credentials: true, origin: true`                              |
| `ValidationPipe`        | `whitelist: true, forbidNonWhitelisted: true, transform: true` |
| **API Versioning**      | URI prefix: `/api/v1/` (global default)                        |

### 5.3 Swagger Configuration

- **URL**: `/docs`
- **Title**: "Electro-Pi API"
- **Auth**: Bearer JWT (`access-token`)
- **Theme**: Custom dark mode (12 CSS rules)
- **Features**: Request duration display, method-sorted operations, persistent auth

### 5.4 Environment Utilities (`utils/env.utils.ts`)

| Function    | Description                            |
| ----------- | -------------------------------------- |
| `toNumber()`| Parse numeric env var with fallback    |
| `toBoolean()`| Parse `"true"/"1"/true` with fallback |

---

## 6. Common Layer (`src/common`)

The **Common Layer** contains reusable artifacts used by all modules.

### 6.1 Decorators

| Decorator     | Purpose                                   |
| ------------- | ----------------------------------------- |
| `@Protected()`| Marks route as requiring authentication   |
| `@Public()`   | Marks route as public (no auth required)  |
| `@Roles(...)` | Restricts route to specific roles         |

### 6.2 Guards

#### `AuthGuard`
- Registered as global `APP_GUARD` in `AuthModule`.
- Checks for `@Protected()` metadata on route/controller.
- Extracts Bearer token from `Authorization` header.
- Verifies access token via `TokenService.verifyAccessToken()`.
- Loads user from database and attaches to `request.user`.

#### `RolesGuard`
- Reads `@Roles()` metadata.
- Checks `request.user.roles` against required roles.
- Throws `ForbiddenException` on mismatch.
- Allows requests without `@Roles()` through.

### 6.3 Interceptors

#### `TransformResponseInterceptor`
Wraps all responses in:
```json
{
  "message": "Operation completed successfully",
  ...originalData
}
```

### 6.4 Global Exception Filter (`filters/http-exception.filter.ts`)

Catches **every** exception. Response shape:
```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-07-29T12:00:00.000Z",
  "path": "/api/v1/tasks",
  "correlationId": "550e8400-e29b-...",
  "message": "Internal server error",
  "stack": "..." // Development only
}
```

### 6.5 Constants (`constants/roles.constants.ts`)

```typescript
UserRoles = { MEMBER: 'member', ADMIN: 'admin' }
DEFAULT_ROLE = 'member'
```

---

## 7. Infrastructure Layer (`src/infrastructure`)

The **Infrastructure Layer** isolates technical adapters from business logic.

### 7.1 Database Module (`database/`)

#### Configuration

| Env Variable        | Development Default |
| ------------------- | ------------------- |
| `DATABASE_HOST`     | `localhost`         |
| `DATABASE_PORT`     | `5432`              |
| `DATABASE_NAME`     | `elector_pi_dev`    |
| `DATABASE_USER`     | `myuser`            |
| `DATABASE_PASSWORD` | `123456`            |

#### Behavior
- `synchronize: true` in **development only** (auto-creates tables).
- `autoLoadEntities: true` (entities auto-discovered).
- `logging: true` in **development only** (SQL queries logged).
- `maxQueryExecutionTime: 1000` (queries >1s logged as warnings).

### 7.2 JWT Module (`jwt/`)

Dual-token authentication system:

| Token   | Default TTL | Secret Env          |
| ------- | ----------- | ------------------- |
| Access  | `15m`       | `JWT_ACCESS_SECRET` |
| Refresh | `7d`        | `JWT_REFRESH_SECRET`|

#### `TokenService` Operations

| Method                        | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `issueAccessToken(payload)`   | Signs access token with type claim             |
| `issueRefreshToken(payload)`  | Signs refresh token with jti + type claim      |
| `issueTokenPair(payload)`     | Returns access + refresh + expiresIn           |
| `verifyAccessToken(token)`    | Validates audience, issuer, secret, and type   |
| `verifyRefreshToken(token)`   | Same but with refresh secret                   |
| `decode(token)`               | Decode without verification                    |
| `getAccessExpiresInSeconds()` | Converts TTL string to seconds                 |

**Token Type Protection**: `verifyAccessToken()` rejects refresh tokens (checks `payload.type`).

### 7.3 Password Module (`password/`)

Wraps `bcrypt` with 10 salt rounds (`BCRYPT_SALT_ROUNDS = 10`).

| Method          | Description                              |
| --------------- | ---------------------------------------- |
| `hash(plain)`   | Hash plaintext with bcrypt + salt        |
| `verify(plain, hashed)` | Constant-time comparison         |

### 7.4 Upload Module (`upload/`)

AWS S3 file storage with **automatic local disk fallback**.

#### `UploaderService`

| Method              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `uploadResource(file, folder)` | Attempts S3 upload; falls back to `./uploads/{folder}/` |
| `deleteResource(key)` | Deletes from S3 or local disk based on key prefix |

**Local fallback behavior**: When S3 fails (IAM policy, network), files save to `./uploads/{folder}/` and return local URLs (`/uploads/{folder}/...`). Files are served statically via `app.useStaticAssets()`.

**Key prefix**: Local files use `local:folder/filename` format; S3 files use `uploads/folder/filename`.

#### Configuration

| Variable              | Default   | Description                 |
| --------------------- | --------- | --------------------------- |
| `AWS_REGION`          | `us-east-1`| AWS region                 |
| `AWS_ACCESS_KEY_ID`   | —         | AWS access key              |
| `AWS_SECRET_ACCESS_KEY`| —        | AWS secret key              |
| `S3_BUCKET_NAME`      | —         | Target bucket               |
| `S3_ENDPOINT`         | —         | Custom endpoint (MinIO)     |
| `S3_FORCE_PATH_STYLE` | `false`   | Path-style addressing       |
| `S3_PUBLIC_BASE_URL`  | —         | CDN / public URL base       |
| `S3_KEY_PREFIX`       | `uploads` | Object key prefix           |

---

## 8. Business Modules (`src/modules`)

### 8.1 Auth Module (`modules/auth/`)

**Purpose**: User registration and login with JWT tokens + httpOnly cookies.

#### Endpoints

| Method | Route              | Auth     | Description                    |
| ------ | ------------------ | -------- | ------------------------------ |
| `POST` | `/api/v1/auth/register` | Public | Register new user (member role) |
| `POST` | `/api/v1/auth/login`    | Public | Login with email + password   |

#### Flow
```
1. Register/Login
2. → Password hashed/verified (bcrypt, 10 rounds)
3. → Token pair issued (access 15m, refresh 7d)
4. → Both tokens set as httpOnly cookies
5. → Access token also returned in response body
```

#### DTOs

**RegisterDto**: `name` (2-100 chars), `email` (valid email), `password` (8-50 chars)

**LoginDto**: `email`, `password`

### 8.2 Users Module (`modules/users/`)

**Purpose**: User management and profile operations.

#### User Entity (`entity/user.entity.ts`)

| Column          | Type              | Notes                                   |
| --------------- | ----------------- | --------------------------------------- |
| `id`            | `uuid`            | Primary key, auto-generated             |
| `name`          | `varchar(100)`    | Display name                            |
| `email`         | `varchar(255)`    | Unique, login identifier                |
| `passwordHash`  | `varchar(255)`    | `select: false` — hidden from queries   |
| `isActive`      | `boolean`         | Soft disable, indexed, default `true`   |
| `roles`         | `enum[]`          | Postgres enum array: `admin` / `member` |
| `profileImage`  | `varchar`         | Nullable, profile picture URL           |
| `createdAt`     | `timestamp`       | Auto-set on insert                      |
| `updatedAt`     | `timestamp`       | Auto-set on update                      |
| `termsAcceptedAt`| `timestamp`      | Nullable                                |
| `termsVersion`  | `varchar(20)`     | Nullable                                |

#### Admin Endpoints (`UserController`, `/api/v1/users`)

| Method  | Route                      | Auth  | Description           |
| ------- | -------------------------- | ----- | --------------------- |
| `GET`   | `/users`                   | Admin | List all users        |
| `GET`   | `/users/:id`               | Admin | Get user by ID        |
| `POST`  | `/users`                   | Admin | Create user           |
| `DELETE`| `/users/:id`               | Admin | Delete user           |
| `PATCH` | `/users/:id/activate`      | Admin | Activate user         |
| `PATCH` | `/users/:id/deactivate`    | Admin | Deactivate user       |

#### Member Endpoints (`MembersController`, `/api/v1/users/members`)

| Method  | Route                      | Auth   | Description                   |
| ------- | -------------------------- | ------ | ----------------------------- |
| `GET`   | `/users/members/me`        | Any    | Get current user profile      |
| `POST`  | `/users/members/me/profile-image`   | Any | Upload profile image    |
| `DELETE`| `/users/members/me/profile-image`   | Any | Remove profile image    |

### 8.3 Projects Module (`modules/projects/`)

**Purpose**: Project CRUD with creator/member access control.

#### Project Entity (`entity/project.entity.ts`)

| Column         | Type           | Notes                              |
| -------------- | -------------- | ---------------------------------- |
| `id`           | `uuid`         | Primary key                        |
| `name`         | `varchar(150)` | Unique project name                |
| `description`  | `text`         | Nullable                           |
| `createdIn`    | `varchar(255)` | Nullable                           |
| `projectStatus`| `enum`         | `open` / `closed`, default: `open` |
| `isActive`     | `boolean`      | Default: `true`                    |
| `projectImage` | `varchar`      | Nullable, cover image URL          |
| `creator`      | `ManyToOne→User`| Project creator                   |
| `members`      | `ManyToMany→User`| Join table: `project_members`     |

#### Admin Endpoints (`ProjectsController`, `/api/v1/projects`)

| Method   | Route                           | Description              |
| -------- | ------------------------------- | ------------------------ |
| `POST`   | `/projects`                     | Create project (multipart) |
| `DELETE` | `/projects/:id`                 | Delete project           |
| `POST`   | `/projects/:id/members/:userId` | Add member to project    |
| `DELETE` | `/projects/:id/members/:userId` | Remove member from project |
| `PATCH`  | `/projects/:id/close`           | Close project            |
| `PATCH`  | `/projects/:id/reopen`          | Reopen project           |

#### Member Endpoints (`ProjectsMembersController`, `/api/v1/members`)

| Method | Route          | Description                          |
| ------ | -------------- | ------------------------------------ |
| `GET`  | `/members`     | List my projects (creator or member) |
| `GET`  | `/members/:id` | Get single project (if has access)   |

#### Access Control
- `findByUser()`: matches `creator.id` OR exists in `members` array.
- Project images: uploaded via S3 (with local fallback), `projectImage` set to `null` if upload fails.
- Duplicate project names rejected with `409 Conflict`.

### 8.4 Tasks Module (`modules/tasks/`)

**Purpose**: Task management with multiple image support and project-based access control.

#### Task Entity (`entity/task.entity.ts`)

| Column        | Type              | Notes                                |
| ------------- | ----------------- | ------------------------------------ |
| `id`          | `uuid`            | Primary key                          |
| `title`       | `varchar(200)`    | Task title                           |
| `description` | `text`            | Nullable                             |
| `status`      | `enum`            | `todo` / `inprogress` / `done`       |
| `priority`    | `enum`            | `low` / `medium` / `high`            |
| `dueDate`     | `timestamp`       | Nullable                             |
| `completedAt` | `timestamp`       | Auto-set when status → `done`; cleared on revert |
| `project`     | `ManyToOne→Project`| Cascade delete                      |
| `creator`     | `ManyToOne→User`  | Task creator                         |
| `assignee`    | `ManyToOne→User`  | Nullable assigned user               |
| `images`      | `OneToMany→TaskImage`| Cascade, up to 10 per upload       |

#### TaskImage Entity (`entity/task-image.entity.ts`)

| Column    | Type           | Notes              |
| --------- | -------------- | ------------------ |
| `id`      | `uuid`         | Primary key        |
| `key`     | `varchar(500)` | S3 key or local path |
| `url`     | `varchar(2000)`| Public URL         |
| `order`   | `int`          | Display order      |
| `task`    | `ManyToOne→Task`| Cascade delete    |

#### Admin Endpoints (`TasksController`, `/api/v1/tasks`)

| Method   | Route                          | Description                          |
| -------- | ------------------------------ | ------------------------------------ |
| `POST`   | `/tasks`                       | Create task (multipart, files[])     |
| `GET`    | `/tasks`                       | List all tasks (user's tasks)        |
| `GET`    | `/tasks/:id`                   | Get task by ID (any user)            |
| `GET`    | `/tasks/project/:projectId`    | Get tasks by project                 |
| `PATCH`  | `/tasks/:id`                   | Update task (multipart)              |
| `PATCH`  | `/tasks/:id/assign/:userId`    | Assign task to user                  |
| `DELETE` | `/tasks/:id/assign`            | Unassign task                        |
| `DELETE` | `/tasks/:id`                   | Delete task + cleanup images         |

#### Member Endpoints (`TasksMembersController`, `/api/v1/members/tasks`)

| Method  | Route                            | Description                        |
| ------- | -------------------------------- | ---------------------------------- |
| `GET`   | `/members/tasks`                 | List my tasks (creator or assignee) |
| `GET`   | `/members/tasks/:id`             | Get task by ID                     |
| `GET`   | `/members/tasks/project/:projectId` | Get tasks by project            |
| `PATCH` | `/members/tasks/:id/status`      | Update task status (assignee or project member) |

#### Access Control & Validation

| Rule                      | Enforcement                                       |
| ------------------------- | ------------------------------------------------- |
| Create task               | User must be project creator or member             |
| Assign task               | Assignee must be project member                    |
| Unassign task             | User must be project member                        |
| Update/Delete task        | User must be project member                        |
| Update status (member)    | Must be task assignee OR project member            |
| Revert from `done`        | Clears `completedAt` to `null`                     |
| View task                 | Any authenticated user (no restriction)            |

---

## 9. API Routing & Endpoints

All routes prefixed with `/api/v1/`.

### Auth

| Method | Route              | Auth   | Description   |
| ------ | ------------------ | ------ | ------------- |
| `POST` | `/auth/register`   | Public | Register      |
| `POST` | `/auth/login`      | Public | Login         |

### Users

| Method   | Route                           | Auth  | Description            |
| -------- | ------------------------------- | ----- | ---------------------- |
| `GET`    | `/users`                        | Admin | List users             |
| `GET`    | `/users/:id`                    | Admin | Get user               |
| `POST`   | `/users`                        | Admin | Create user            |
| `DELETE` | `/users/:id`                    | Admin | Delete user            |
| `PATCH`  | `/users/:id/activate`           | Admin | Activate user          |
| `PATCH`  | `/users/:id/deactivate`         | Admin | Deactivate user        |
| `GET`    | `/users/members/me`             | Any   | Get profile            |
| `POST`   | `/users/members/me/profile-image`| Any  | Upload profile image   |
| `DELETE` | `/users/members/me/profile-image`| Any  | Remove profile image   |

### Projects

| Method   | Route                           | Auth  | Description           |
| -------- | ------------------------------- | ----- | --------------------- |
| `POST`   | `/projects`                     | Admin | Create project        |
| `DELETE` | `/projects/:id`                 | Admin | Delete project        |
| `POST`   | `/projects/:id/members/:userId` | Admin | Add member            |
| `DELETE` | `/projects/:id/members/:userId` | Admin | Remove member         |
| `PATCH`  | `/projects/:id/close`           | Admin | Close project         |
| `PATCH`  | `/projects/:id/reopen`          | Admin | Reopen project        |
| `GET`    | `/members`                      | Any   | List my projects      |
| `GET`    | `/members/:id`                  | Any   | Get project (if access)|

### Tasks

| Method   | Route                                | Auth  | Description              |
| -------- | ------------------------------------ | ----- | ------------------------ |
| `POST`   | `/tasks`                             | Admin | Create task              |
| `GET`    | `/tasks`                             | Admin | List tasks               |
| `GET`    | `/tasks/:id`                         | Admin | Get task                 |
| `GET`    | `/tasks/project/:projectId`          | Admin | Tasks by project         |
| `PATCH`  | `/tasks/:id`                         | Admin | Update task              |
| `PATCH`  | `/tasks/:id/assign/:userId`          | Admin | Assign user              |
| `DELETE` | `/tasks/:id/assign`                  | Admin | Unassign task            |
| `DELETE` | `/tasks/:id`                         | Admin | Delete task              |
| `GET`    | `/members/tasks`                     | Any   | List my tasks            |
| `GET`    | `/members/tasks/:id`                 | Any   | Get task                 |
| `GET`    | `/members/tasks/project/:projectId`  | Any   | Tasks by project         |
| `PATCH`  | `/members/tasks/:id/status`          | Any   | Update status            |

---

## 10. Configuration & Environment

### Environment File

Single `.env` file loaded via `ConfigModule.forRoot({ isGlobal: true })`.

### All Environment Variables

See [Section 18](#18-quick-reference--all-environment-variables).

### Key Defaults

| Setting            | Development Default                                |
| ------------------ | -------------------------------------------------- |
| Port               | `3000`                                             |
| Swagger            | Enabled (non-production)                           |
| Database sync      | `true` (auto-sync in dev)                          |
| Rate limit         | 60 req/min default, 10 req/min strict, 35/15min auth|
| JWT access TTL     | `15m`                                              |
| JWT refresh TTL    | `7d`                                               |
| Bcrypt rounds      | `10`                                               |

---

## 11. Authentication & Authorization

### Flow

```
1. Register/Login → Token pair (access 15m + refresh 7d)
2. Both tokens set as httpOnly cookies
3. Access token also returned in response body
4. Each API request → Authorization: Bearer <access_token>
5. AuthGuard (global) → verifies access token
6. RolesGuard → checks @Roles() metadata against user.roles
```

### JWT Token Structure

**Access Token:**
```json
{
  "sub": "user-uuid",
  "roles": ["admin", "member"],
  "type": "access",
  "iat": 1740000000,
  "exp": 1740000900,
  "iss": "noviq-api",
  "aud": "noviq-client"
}
```

**Refresh Token:**
```json
{
  "sub": "user-uuid",
  "roles": ["admin"],
  "type": "refresh",
  "jti": "unique-token-id",
  "iat": 1740000000,
  "exp": 1740604800,
  "iss": "noviq-api",
  "aud": "noviq-client"
}
```

### Security Features

| Feature                   | Implementation                                                    |
| ------------------------- | ----------------------------------------------------------------- |
| Token type validation     | `verifyAccessToken()` rejects refresh tokens                       |
| Separate secrets          | Access and refresh use independent signing keys                    |
| Token ID (jti)            | Each refresh token has a unique ID                                 |
| Short-lived access        | 15-minute access tokens limit exposure                             |
| Helmet                    | Security headers (CSP disabled for Swagger)                        |
| CORS                      | Credentialed requests, all origins                                 |
| Rate limiting             | 3 tiers: default (60/min), strict (10/min), auth (35/15min)        |

---

## 12. Database Schema

### Table: `users`

```sql
CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash"   VARCHAR(255) NOT NULL,
  "isActive"       BOOLEAN DEFAULT true,
  roles            users_roles_enum[] DEFAULT '{member}',
  "profileImage"   VARCHAR NULL,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMP NOT NULL DEFAULT now(),
  "termsAcceptedAt" TIMESTAMP,
  "termsVersion"   VARCHAR(20)
);
```

### Table: `projects`

```sql
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(150) NOT NULL UNIQUE,
  description      TEXT,
  "createdIn"      VARCHAR(255),
  "projectStatus"  projects_projectstatus_enum DEFAULT 'open',
  "isActive"       BOOLEAN DEFAULT true,
  "projectImage"   VARCHAR,
  "creator_id"     UUID REFERENCES users(id),
  "createdAt"      TIMESTAMP DEFAULT now(),
  "updatedAt"      TIMESTAMP DEFAULT now()
);
```

### Table: `project_members`

```sql
CREATE TABLE project_members (
  "project_id" UUID REFERENCES projects(id) ON DELETE CASCADE,
  "user_id"    UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY ("project_id", "user_id")
);
```

### Table: `tasks`

```sql
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  status          tasks_status_enum DEFAULT 'todo',
  priority        tasks_priority_enum DEFAULT 'medium',
  "dueDate"       TIMESTAMP,
  "completedAt"   TIMESTAMP,
  "project_id"    UUID REFERENCES projects(id) ON DELETE CASCADE,
  "creator_id"    UUID REFERENCES users(id),
  "assignee_id"   UUID REFERENCES users(id),
  "createdAt"     TIMESTAMP DEFAULT now(),
  "updatedAt"     TIMESTAMP DEFAULT now()
);
```

### Table: `task_images`

```sql
CREATE TABLE task_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        VARCHAR(500) NOT NULL,
  url        VARCHAR(2000) NOT NULL,
  "order"    INT DEFAULT 0,
  "task_id"  UUID REFERENCES tasks(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT now()
);
```

---

## 13. File Storage (S3)

### Upload Flow

```
Client
  │
  ├─ POST /projects (multipart: file)  →  UploaderService.uploadResource()
  │                                         ├── S3 PutObject
  │                                         └── (fail) → save to ./uploads/
  │
  ├─ POST /tasks (multipart: files[]) →  UploaderService.uploadResource() × N
  │
  ├─ GET /uploads/project-covers/...  →  Static file serving (local fallback)
  │
  └─ DELETE /projects/:id or /tasks/:id → UploaderService.deleteResource()
```

### Local Disk Fallback

When S3 `PutObject` fails (IAM permission, network issue):
- File saved to `./uploads/{folder}/timestamp-filename.ext`
- URL returned as `/uploads/{folder}/...`
- Served via `app.useStaticAssets(join(cwd, 'uploads'), { prefix: '/uploads' })`
- Keys prefixed with `local:` for proper cleanup identification

### S3 Configuration

| Variable              | Default   | Description                 |
| --------------------- | --------- | --------------------------- |
| `AWS_REGION`          | `us-east-1`| AWS region                 |
| `AWS_ACCESS_KEY_ID`   | —         | AWS access key              |
| `AWS_SECRET_ACCESS_KEY`| —        | AWS secret key              |
| `S3_BUCKET_NAME`      | —         | Target bucket               |
| `S3_KEY_PREFIX`       | `uploads` | Object key prefix           |

---

## 14. Error Handling

### Global Exception Filter

All unhandled exceptions flow through `AllExceptionsFilter`:

```
Exception thrown
    ↓
AllExceptionsFilter.catch()
    ├── Extract HTTP status (or 500)
    ├── Generate correlationId (UUID)
    ├── Extract message
    └── Log via Logger with correlationId
    ↓
HTTP Response
    ├── success: false
    ├── statusCode
    ├── timestamp (ISO 8601)
    ├── path
    ├── correlationId
    ├── message
    └── stack (development only)
```

### HTTP Exception Mapping

| Exception               | Status | Example Message                                           |
| ----------------------- | ------ | -------------------------------------------------------- |
| `UnauthorizedException` | 401    | "Invalid email or password." / "No token provided"        |
| `ForbiddenException`    | 403    | "You do not have access to modify tasks in this project"  |
| `NotFoundException`     | 404    | "Task not found" / "Project not found"                   |
| `ConflictException`     | 409    | "A project with this name already exists"                |
| `ValidationPipe`        | 400    | Array of validation error strings                        |

---

## 15. Rate Limiting & Security

### Rate Limiting Tiers

| Tier      | Window  | Limit | Applied To              |
| --------- | ------- | ----- | ----------------------- |
| `default` | 1 min   | 60    | All general API routes  |
| `strict`  | 1 min   | 10    | Sensitive endpoints     |
| `auth`    | 15 min  | 35    | Login / register        |

### Security Headers (Helmet)

All standard security headers applied. CSP disabled for Swagger UI compatibility.

### CORS

```typescript
{
  credentials: true,  // Allow cookies/auth headers
  origin: true         // Reflect all origins
}
```

### Validation Pipe

| Setting                      | Effect                                      |
| ---------------------------- | ------------------------------------------- |
| `whitelist: true`            | Strips unknown properties                   |
| `forbidNonWhitelisted: true` | Returns 400 on unknown properties           |
| `transform: true`            | Auto-converts types (string → number, etc.) |

---

## 16. Swagger API Documentation

- **URL**: `http://localhost:3000/docs`
- **Title**: "Electro-Pi API Docs"
- **Auth**: Bearer JWT (enter via "Authorize" button)

### Visual Theme

Custom dark theme:
- Dark backgrounds (`#0b1120`, `#111827`, `#030712`)
- Light text (`#e5e7eb`, `#f9fafb`)
- Styled form inputs and code blocks

### Interactive Features
- **Try it out**: Execute API calls from browser
- **Request duration**: Shows how long each request took
- **Persistent auth**: Token saved across page reloads
- **Sorted**: Tags alphabetically, methods by HTTP method

---

## 17. DevOps & Deployment

### Docker

**Multi-stage Dockerfile** (`node:22-alpine`):
1. **Builder stage**: `npm ci` → `npm run build`
2. **Release stage**: production deps only (`npm ci --omit=dev`), runs as `node` user

**docker-compose.yml**:
- `api`: Electro-Pi API container (port 3000)
- `postgres`: PostgreSQL 16 Alpine with healthcheck
- `redis`: Redis 7 Alpine with AOF persistence, 256MB max memory, LRU eviction

```bash
# Start all services
docker compose up -d

# Rebuild API after changes
docker compose up -d --build api

# View logs
docker compose logs -f api
```

### Build & Run

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Lint
npm run lint

# Format
npm run format

# Tests
npm test
npm run test:e2e
npm run test:cov
```

---

## 18. Quick Reference — All Environment Variables

### Application

| Variable         | Default        | Description                        |
| ---------------- | -------------- | ---------------------------------- |
| `NODE_ENV`       | `development`  | Environment                        |
| `PORT`           | `3000`         | HTTP server port                   |
| `ENABLE_SWAGGER` | `true` (non-prod)| Enable Swagger at `/docs`        |

### Database (PostgreSQL)

| Variable            | Default             | Description       |
| ------------------- | ------------------- | ----------------- |
| `DATABASE_HOST`     | `localhost`         | PostgreSQL host   |
| `DATABASE_PORT`     | `5432`              | PostgreSQL port   |
| `DATABASE_NAME`     | `elector_pi_dev`    | Database name     |
| `DATABASE_USER`     | `myuser`            | Database username |
| `DATABASE_PASSWORD` | `123456`            | Database password |

### Redis

| Variable          | Default     | Description           |
| ----------------- | ----------- | --------------------- |
| `REDIS_HOST`      | `localhost` | Redis host            |
| `REDIS_PORT`      | `6379`      | Redis port            |
| `REDIS_PASSWORD`  | `123456`    | Redis password        |
| `REDIS_DB`        | `0`         | Redis database number |
| `REDIS_KEY_PREFIX`| `noviq:`    | Key namespace         |

### JWT

| Variable             | Default                                        | Description               |
| -------------------- | ---------------------------------------------- | ------------------------- |
| `JWT_ACCESS_SECRET`  | `noviq-dev-access-token-secret-change-me`      | Access token signing key  |
| `JWT_REFRESH_SECRET` | `noviq-dev-refresh-token-secret-change-me`     | Refresh token signing key |
| `JWT_ACCESS_TTL`     | `15m`                                          | Access token lifetime     |
| `JWT_REFRESH_TTL`    | `7d`                                           | Refresh token lifetime    |
| `JWT_ISSUER`         | `noviq-api`                                    | JWT issuer claim          |
| `JWT_AUDIENCE`       | `noviq-client`                                 | JWT audience claim        |

### AWS S3

| Variable                        | Default   | Description                 |
| ------------------------------- | --------- | --------------------------- |
| `AWS_REGION`                    | `us-east-1`| AWS region                 |
| `AWS_ACCESS_KEY_ID`             | —         | AWS access key              |
| `AWS_SECRET_ACCESS_KEY`         | —         | AWS secret key              |
| `S3_BUCKET_NAME`                | —         | S3 bucket name              |
| `S3_ENDPOINT`                   | —         | Custom endpoint (MinIO)     |
| `S3_FORCE_PATH_STYLE`           | `false`   | Path-style URLs             |
| `S3_PUBLIC_BASE_URL`            | —         | CDN / public URL base       |
| `S3_SIGNED_URL_EXPIRES_SECONDS` | `900`     | Signed URL lifetime (15 min)|
| `S3_KEY_PREFIX`                 | `uploads` | Object key prefix           |

### Rate Limiting

| Variable         | Default | Description                   |
| ---------------- | ------- | ----------------------------- |
| `THROTTLE_TTL`   | `60000` | Default rate limit window (ms)|
| `THROTTLE_LIMIT` | `60`    | Default max requests/window   |

---

> **Document Version:** 1.0  
> **Generated:** 2026-07-29  
> **Repository:** `electro-pi-api` — The backend powering the Electro-Pi collaboration platform.
