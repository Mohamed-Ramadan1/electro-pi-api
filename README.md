# Electro-Pi API — Comprehensive Project Documentation

> **Version:** `0.0.1`  
> **License:** UNLICENSED (Private)  
> **Last Updated:** 2026-08-20

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
14. [Background Jobs & Queues](#14-background-jobs--queues)
15. [Error Handling](#15-error-handling)
16. [Rate Limiting & Security](#16-rate-limiting--security)
17. [Swagger API Documentation](#17-swagger-api-documentation)
18. [DevOps & Deployment](#18-devops--deployment)
19. [Quick Reference — All Environment Variables](#19-quick-reference--all-environment-variables)

---

## 1. Project Overview

**Electro-Pi** is a project management and collaboration platform. This repository (`electro-pi-api`) is the **backend API** that powers the entire Electro-Pi ecosystem.

### Core Purpose

- Provide a secure, scalable REST API for team project management.
- Manage user identities, authentication, and role-based authorization (admin/member).
- Serve as the central hub for **projects**, **tasks**, **teams**, **notes**, **reminders**, and **notifications**.
- Schedule and deliver background work (reminders → notifications) via Redis-backed queues (BullMQ).
- Store and serve user-uploaded content (project covers, task images, note images) via AWS S3 with local disk fallback.

### Key Design Goals

- **Modular Architecture**: clear separation of concerns — each feature module owns its full vertical slice (entity, repository, service, controller).
- **Infrastructure Abstraction**: technical adapters (database, JWT, S3 upload, password hashing, queues) are isolated in the infrastructure layer.
- **Production-Ready**: structured logging, rate limiting, global error handling, helmet security headers, and environment-based configuration.
- **Migration-Driven Schema**: database schema managed exclusively through TypeORM migrations (`migrationsRun: true`).
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
| `@nestjs/jwt`              | JWT token generation & verification     |
| `@nestjs/typeorm`          | TypeORM integration for NestJS          |
| `@nestjs/bullmq`           | BullMQ queue integration                |
| `@nestjs/schedule`         | Cron scheduling (installed; currently unused) |
| `@nestjs/passport`         | Authentication framework (installed)    |

### Database & Caching

| Package  | Purpose                     |
| -------- | --------------------------- |
| `typeorm` | ORM for database operations |
| `pg`      | PostgreSQL driver           |
| `bullmq`  | Redis-backed job queues     |

### Queues & Monitoring

| Package                | Purpose                         |
| ---------------------- | ------------------------------- |
| `bullmq`               | Job / queue engine              |
| `@bull-board/api`      | Queue dashboard API             |
| `@bull-board/express`  | Queue dashboard adapter         |
| `@bull-board/nestjs`   | Queue dashboard NestJS module   |

### Security

| Package         | Purpose                  |
| --------------- | ------------------------ |
| `bcrypt`        | Password hashing         |
| `passport`      | Authentication framework |
| `passport-jwt`  | JWT strategy             |
| `helmet`        | HTTP security headers    |
| `cookie-parser` | Cookie parsing           |

### Storage & Cloud

| Package                       | Purpose                 |
| ----------------------------- | ----------------------- |
| `@aws-sdk/client-s3`          | AWS S3 client SDK       |
| `@aws-sdk/lib-storage`        | Multipart S3 uploads    |
| `@aws-sdk/s3-request-presigner` | Pre-signed URL generation |

### Upload & Logging

| Package        | Purpose                  |
| -------------- | ------------------------ |
| `multer`       | File upload handling     |
| `nestjs-pino`  | Structured logging (installed) |
| `compression`  | HTTP response compression (installed) |

### Validation & Transformation

| Package             | Purpose                       |
| ------------------- | ----------------------------- |
| `class-validator`   | DTO validation decorators     |
| `class-transformer` | Plain-to-class transformation |

### Development Tools

| Package        | Purpose                       |
| -------------- | ----------------------------- |
| `@nestjs/cli`  | NestJS project scaffolding    |
| `@swc/core`    | Fast TypeScript compilation   |
| `eslint` (9.x) | Linting (flat config)         |
| `prettier`     | Code formatting               |
| `jest`         | Test runner                   |
| `ts-jest`      | TypeScript transform for Jest |
| `supertest`    | HTTP assertion for e2e tests  |

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
        │  (TypeORM)   │  │  (BullMQ)   │  │  (+ local)   │
        └─────────────┘  └─────────────┘  └──────────────┘
```

### Module Internal Structure

Each feature module inside `src/modules/` follows a flat vertical-slice structure:

```
modules/<feature>/
  ├── constants/ (or const/)   # Feature-specific constants & enums
  ├── controller/ (or controllers/) # HTTP controllers (admin + member)
  ├── dto/                      # Data transfer objects / validation
  ├── entity/                   # TypeORM entities
  ├── repo/ (or repos/, repository/) # Repository pattern wrappers
  ├── services/ (or service/)   # Business logic services
  ├── processors/               # (reminders) BullMQ workers
  └── <feature>.module.ts
```

> Note: the subfolder naming is not yet fully uniform across modules (some use `service/`, others `services/`; `repo/` vs `repos/` vs `repository/`). This is a known inconsistency to normalize.

### Key Architectural Principles

1. **Separation of Concerns**: Infrastructure adapters (S3, JWT, bcrypt, queues) are isolated from business logic. A business module imports the adapter *service* (e.g. `UploaderService`, `QueueService`), never a raw client.

2. **Global-by-Default for Cross-Cutting Concerns**: `CoreModule` registers the global exception filter and the throttle + auth guards, so every module gets them automatically.

3. **Role-Based Access Control**: `@Roles('admin')` + `RolesGuard` on controllers; `@Protected()` marks routes requiring authentication; `@Public()` allows unauthenticated access.

4. **Fail-Fast on Configuration**: JWT secrets are validated at startup in production; dev-only fallbacks prevent accidental production deployment.

5. **Dual Controller Pattern**: Admin controllers (write operations) sit under `/projects`, `/tasks`, `/teams`, `/users`; member controllers (read/self-service) sit under `/members` — a clean separation of admin vs. member concerns.

6. **Base Entity Inheritance**: Every entity extends `BaseEntity`, which provides `id` (uuid), `createdAt`, `updatedAt`, and `isActive` (soft-disable flag) columns.

---

## 4. Complete Folder Structure

```
electro-pi-api/
│
├── docker-compose.yml             # PostgreSQL + Redis + API
├── Dockerfile                     # Multi-stage (node:22-alpine)
├── .dockerignore
├── .env / .env.example / .env.test
│
├── src/                           # █████████ SOURCE CODE █████████
│   │
│   ├── main.ts                    # Entry point (bootstrap + static assets)
│   ├── app.module.ts              # Root NestJS module
│   │
│   ├── core/                      # ── CORE LAYER ──
│   │   ├── core.module.ts         # Config, throttler, global guards/filter
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
│   │   │   ├── protected.decorator.ts   # @Protected()
│   │   │   ├── public.decorator.ts      # @Public()
│   │   │   ├── roles.decorator.ts       # @Roles(...)
│   │   │   └── current-user.decorator.ts # @CurrentUser()
│   │   ├── entities/
│   │   │   └── base.entity.ts     # id / createdAt / updatedAt / isActive
│   │   ├── enums/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception filter
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # JWT token verification
│   │   │   └── roles.guard.ts     # Role-based access control
│   │   ├── interceptors/
│   │   │   └── transform-response.interceptor.ts
│   │   ├── interfaces/
│   │   │   ├── authenticated-user.interface.ts
│   │   │   └── uploadedFile.interface.ts
│   │   ├── pipes/
│   │   │   └── file-size-validation.pipe.ts
│   │   └── types/
│   │       └── express.d.ts       # Express Request augmentation
│   │
│   ├── infrastructure/            # ── INFRASTRUCTURE LAYER ──
│   │   ├── infrastructure.module.ts
│   │   ├── index.ts
│   │   │
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── data-source.ts
│   │   │   ├── data-source-test.ts
│   │   │   └── services/
│   │   │       └── database.service.ts
│   │   │
│   │   ├── jwt/
│   │   │   ├── jwt.module.ts
│   │   │   ├── config/jwt.config.ts
│   │   │   ├── constants/jwt.constants.ts
│   │   │   ├── services/token.service.ts
│   │   │   └── types/             # jwt-config, jwt-payload, token-pair, …
│   │   │
│   │   ├── password/
│   │   │   ├── password.module.ts
│   │   │   ├── constants/password.constants.ts
│   │   │   └── services/password.service.ts
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.module.ts
│   │   │   └── services/uploader.service.ts
│   │   │
│   │   ├── queues/
│   │   │   ├── queues.module.ts
│   │   │   ├── config/queue.config.ts
│   │   │   ├── constants/queue.const.ts
│   │   │   ├── service/queue.service.ts
│   │   │   └── types/queue-job.type.ts
│   │   │
│   │   └── mails/
│   │       └── mails.module.ts    # Stub — reserved for future email jobs
│   │
│   ├── migrations/                # TypeORM migrations (schema source of truth)
│   │   ├── 1785334726829-InitialMigration.ts
│   │   ├── 1785599658233-Migration.ts
│   │   ├── 1785634811182-Migration.ts
│   │   ├── 1785717059297-AddNotificationFields.ts
│   │   ├── 1785717530330-Migration.ts
│   │   ├── 1785884980457-Migration.ts
│   │   ├── 1786515984428-Migration.ts
│   │   ├── 1787052504661-Migration.ts
│   │   ├── 1787136807714-Migration.ts
│   │   ├── 1787205659284-Migration.ts
│   │   └── 1787209613657-Migration.ts # team_projects → project_teams
│   │
│   └── modules/                   # ── BUSINESS MODULES ──
│       ├── modules.module.ts      # Aggregates all feature modules
│       │
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── controllers/auth.controller.ts
│       │   ├── dto/ (login, register)
│       │   ├── services/auth.service.ts
│       │   └── types/
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── controller/ (user.controller.ts, members.controller.ts)
│       │   ├── dto/ (create-user.dto.ts)
│       │   ├── entity/user.entity.ts
│       │   ├── repository/user.repo.ts
│       │   └── services/user.service.ts
│       │
│       ├── projects/
│       │   ├── projects.module.ts
│       │   ├── constants/projects.cons.ts
│       │   ├── controller/ (projects.controller.ts, projects-members.controller.ts)
│       │   ├── dto/create-project.dto.ts
│       │   ├── entity/project.entity.ts
│       │   ├── repo/project.repo.ts
│       │   └── services/projects.service.ts
│       │
│       ├── tasks/
│       │   ├── tasks.module.ts
│       │   ├── constants/taskst.const.ts
│       │   ├── controller/ (tasks.controller.ts, tasks-members.controller.ts)
│       │   ├── dto/ (create-task, update-task, update-task-status)
│       │   ├── entity/ (task.entity.ts, task-image.entity.ts)
│       │   ├── repo/task.repo.ts
│       │   └── services/tasks.service.ts
│       │
│       ├── teams/
│       │   ├── teams.module.ts
│       │   ├── constants/teams.cons.ts
│       │   ├── controller/teams.controller.ts
│       │   ├── dto/ (create-team, update-team, add-member-to-team,
│       │   │          team-response, team-member-response)
│       │   ├── entity/ (teams.entity.ts, teams-members.entity.ts)
│       │   ├── repos/ (teams.repo.ts, teams-members.repo.ts)
│       │   └── service/teams.service.ts
│       │
│       ├── notes/
│       │   ├── notes.module.ts
│       │   ├── controller/notes.controller.ts
│       │   ├── dto/ (createNote, updateNote, noteResponse)
│       │   ├── entity/notes.entity.ts
│       │   ├── repo/notes.repo.ts
│       │   ├── service/notes.service.ts
│       │   └── types/createNote.type.ts
│       │
│       ├── reminders/
│       │   ├── reminders.module.ts
│       │   ├── const/repeatInterval.const.ts
│       │   ├── controller/reminders.controller.ts
│       │   ├── dto/ (create, update, reschedule, snooze, reminder-response)
│       │   ├── entity/reminder.entity.ts
│       │   ├── interfaces/reminder-job-data.interface.ts
│       │   ├── processors/reminders.processor.ts
│       │   ├── repo/reminders.repo.ts
│       │   ├── service/reminders.service.ts
│       │   └── types/queue-jobs.type.ts
│       │
│       ├── notifications/
│       │   ├── notifications.module.ts
│       │   ├── constants/notifications.const.ts
│       │   ├── controller/notifications.controller.ts
│       │   ├── dto/ (create-notification, notification-response)
│       │   ├── entity/notifications.entity.ts
│       │   ├── repo/notifications.repo.ts
│       │   └── service/notifications.service.ts
│       │
│       └── dashboard/             # Stub — reserved for future
│           ├── dashboard.module.ts
│           ├── controller/dashboard.controller.ts
│           └── service/dashboard.service.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   ├── factories/
│   ├── helpers/
│   ├── integration/
│   ├── jest-e2e.json
│   └── jest-int.json
│
├── uploads/                       # Local disk fallback for file uploads
│
├── docs/                          # Planning / design notes
│   └── teams-project-task-decoupling.md
│
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

| Name      | Window | Limit | Use Case             |
| --------- | ------ | ----- | -------------------- |
| `default` | 1 min  | 250   | General API requests |
| `strict`  | 1 min  | 250   | Sensitive endpoints  |
| `auth`    | 15 min | 35    | Login / register     |

#### Global Providers

| Provider              | Scope        | Purpose                            |
| --------------------- | ------------ | ---------------------------------- |
| `AllExceptionsFilter` | `APP_FILTER` | Catches every unhandled exception  |
| `ThrottlerGuard`      | `APP_GUARD`  | Enforces rate limits on all routes |
| `AuthGuard`           | `APP_GUARD`  | Verifies JWT on `@Protected()` routes |

### 5.2 Bootstrap Helpers (`bootstrap/app.bootstrap.ts`)

`configureApplication(app)` applies:

| Setting                 | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| `enableShutdownHooks()` | Graceful shutdown on SIGTERM/SIGINT                            |
| `helmet()`              | CSP disabled (for Swagger)                                     |
| `cookieParser()`        | Parse cookies for auth flows                                   |
| `enableCors()`          | `credentials: true, origin: true`                              |
| `ValidationPipe`        | `whitelist: true, forbidNonWhitelisted: true, transform: true` |
| **API Versioning**      | URI prefix `api/v` + default version `1` → `/api/v1/`          |

### 5.3 Swagger Configuration

- **URL**: `/docs`
- **Title**: "Electro-Pi API"
- **Description**: "The place where you and team meet to be productive"
- **Version**: `1.0`
- **Auth**: Bearer JWT (`access-token`)
- **Theme**: Custom dark mode (12 CSS rules)
- **Features**: Request duration display, method-sorted operations, persistent auth, alpha-sorted tags

### 5.4 Environment Utilities (`utils/env.utils.ts`)

| Function      | Description                           |
| ------------- | ------------------------------------- |
| `toNumber()`  | Parse numeric env var with fallback   |
| `toBoolean()` | Parse `"true"/"1"/true` with fallback |

---

## 6. Common Layer (`src/common`)

The **Common Layer** contains reusable artifacts used by all modules.

### 6.1 Decorators

| Decorator      | Purpose                                  |
| -------------- | ---------------------------------------- |
| `@Protected()` | Marks route as requiring authentication  |
| `@Public()`    | Marks route as public (no auth required) |
| `@Roles(...)`  | Restricts route to specific roles        |
| `@CurrentUser()` | Injects the authenticated user (or a field of it) into the handler |

### 6.2 Guards

#### `AuthGuard`

- Registered as global `APP_GUARD` in `CoreModule`.
- Checks for `@Protected()` metadata on route/controller.
- Extracts Bearer token from the `Authorization` header.
- Verifies access token via `TokenService.verifyAccessToken()`.
- Loads the user from the database and attaches it to `request.user`.

#### `RolesGuard`

- Reads `@Roles()` metadata.
- Checks `request.user.roles` against required roles.
- Throws `ForbiddenException` on mismatch.
- Allows requests without `@Roles()` through.

### 6.3 Interceptors

#### `TransformResponseInterceptor`

Wraps all responses in a consistent envelope:

```json
{
  "message": "Operation completed successfully",
  "...controllerFields": "..."
}
```

The controller's `message` (when present) is preserved, and any additional fields the controller returns (e.g. `users`, `tasks`, `data`, `results`) are spread alongside it.

### 6.4 Global Exception Filter (`filters/http-exception.filter.ts`)

Catches **every** exception. Response shape:

```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-08-20T12:00:00.000Z",
  "path": "/api/v1/tasks",
  "correlationId": "550e8400-e29b-...",
  "message": "Internal server error",
  "stack": "..." // Development only
}
```

### 6.5 Constants (`constants/roles.constants.ts`)

```typescript
UserRoles = { MEMBER: 'member', ADMIN: 'admin' };
DEFAULT_ROLE = 'member';
```

### 6.6 Pipes (`pipes/file-size-validation.pipe.ts`)

`FileSizeValidationPipe` rejects uploaded files larger than **2 MB** (`413 Payload Too Large`).

### 6.7 Base Entity (`entities/base.entity.ts`)

Every entity extends `BaseEntity`, gaining:

| Column      | Type      | Notes                         |
| ----------- | --------- | ----------------------------- |
| `id`        | `uuid`    | Primary key (`gen_random_uuid()`) |
| `createdAt` | `timestamp` | Auto-set on insert          |
| `updatedAt` | `timestamp` | Auto-set on update          |
| `isActive`  | `boolean` | Indexed, default `true` (soft-disable) |

---

## 7. Infrastructure Layer (`src/infrastructure`)

The **Infrastructure Layer** isolates technical adapters from business logic.

### 7.1 Database Module (`database/`)

#### Configuration

| Env Variable        | Development Default |
| ------------------- | ------------------- |
| `DATABASE_HOST`     | `localhost`         |
| `DATABASE_PORT`     | `5432`              |
| `DATABASE_NAME`     | `electro_pi_dev`    |
| `DATABASE_USER`     | `postgres`          |
| `DATABASE_PASSWORD` | `postgres`          |

#### Behavior

- `synchronize: false` — schema is **never** auto-synced.
- `migrationsRun: true` — migrations run automatically on startup.
- `autoLoadEntities: true` (entities auto-discovered via glob).
- `migrationsTableName: 'typeorm_migrations'`.
- `logging: true` in development (SQL queries logged).
- `maxQueryExecutionTime: 1000` (queries >1s logged as warnings).

> Migrations are the **single source of truth** for the schema. Generate new migrations with `npm run migration:generate` and apply with `npm run migration:run`.

### 7.2 JWT Module (`jwt/`)

Dual-token authentication system:

| Token   | Default TTL | Secret Env           |
| ------- | ----------- | -------------------- |
| Access  | `15m`       | `JWT_ACCESS_SECRET`  |
| Refresh | `7d`        | `JWT_REFRESH_SECRET` |

#### `TokenService` Operations

| Method                        | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `issueAccessToken(payload)`   | Signs access token with type claim           |
| `issueRefreshToken(payload)`  | Signs refresh token with jti + type claim    |
| `issueTokenPair(payload)`     | Returns access + refresh + expiresIn         |
| `verifyAccessToken(token)`    | Validates audience, issuer, secret, and type |
| `verifyRefreshToken(token)`   | Same but with refresh secret                 |
| `decode(token)`               | Decode without verification                  |
| `getAccessExpiresInSeconds()` | Converts TTL string to seconds               |

**Token Type Protection**: `verifyAccessToken()` rejects refresh tokens (checks `payload.type`).

### 7.3 Password Module (`password/`)

Wraps `bcrypt` with 10 salt rounds (`BCRYPT_SALT_ROUNDS = 10`).

| Method                  | Description                       |
| ----------------------- | --------------------------------- |
| `hash(plain)`           | Hash plaintext with bcrypt + salt |
| `verify(plain, hashed)` | Constant-time comparison          |

### 7.4 Upload Module (`upload/`)

AWS S3 file storage with **automatic local disk fallback**.

#### `UploaderService`

| Method                         | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| `uploadResource(file, folder)` | Attempts S3 upload; falls back to `./uploads/{folder}/` |
| `deleteResource(key)`          | Deletes from S3 or local disk based on key prefix       |
| `getSignedUrl(key, ttl)`       | Returns pre-signed URL (or local/static URL) for a key |

**Local fallback behavior**: When S3 fails (IAM policy, network), files save to `./uploads/{folder}/` and return local URLs (`/uploads/{folder}/...`). Files are served statically via `app.useStaticAssets()`.

**Key prefix**: Local files use `local:folder/filename` format; S3 files use `uploads/folder/filename`.

#### Configuration

| Variable                | Default     | Description             |
| ----------------------- | ----------- | ----------------------- |
| `AWS_REGION`            | `us-east-1` | AWS region              |
| `AWS_ACCESS_KEY_ID`     | —           | AWS access key          |
| `AWS_SECRET_ACCESS_KEY` | —           | AWS secret key          |
| `S3_BUCKET_NAME`        | —           | Target bucket           |
| `S3_ENDPOINT`           | —           | Custom endpoint (MinIO) |
| `S3_FORCE_PATH_STYLE`   | `false`     | Path-style addressing   |
| `S3_PUBLIC_BASE_URL`    | —           | CDN / public URL base   |
| `S3_KEY_PREFIX`         | `uploads`   | Object key prefix       |

### 7.5 Queues Module (`queues/`)

Redis-backed job queues via **BullMQ**, with a **Bull Board** admin UI at `/admin/queues`.

#### Registered Queues

| Queue name      | Purpose                                   |
| --------------- | ----------------------------------------- |
| `default`       | General-purpose jobs                      |
| `email`         | Reserved for outgoing email jobs          |
| `notification`  | Reserved for notification fan-out         |
| `reminders`     | Reminder scheduling & delivery            |

#### `QueueService`

| Method                              | Description                          |
| ----------------------------------- | ------------------------------------ |
| `add(queue, name, data, options?)`  | Enqueue a job                        |
| `addDelayed(queue, name, data, ms)` | Enqueue a job with delay             |
| `addBulk(queue, jobs)`              | Enqueue multiple jobs at once        |
| `getQueue(name)`                    | Resolve a registered queue by name   |

#### Queue Defaults

| Setting             | Default       |
| ------------------- | ------------- |
| `attempts`          | 3             |
| `backoff`           | exponential, 5s delay |
| `removeOnComplete`  | 1000          |
| `removeOnFail`      | 5000          |
| `prefix`            | `electro-pi`  |
| Redis DB            | 1             |

### 7.6 Mails Module (`mails/`)

Empty stub module — reserved for future email delivery (Nodemailer-based). `EMAIL_*` environment variables are already defined in `.env.example`.

---

## 8. Business Modules (`src/modules`)

### 8.1 Auth Module (`modules/auth/`)

**Purpose**: User registration and login with JWT tokens + httpOnly cookies.

#### Endpoints

| Method | Route                   | Auth   | Description                     |
| ------ | ----------------------- | ------ | ------------------------------- |
| `POST` | `/api/v1/auth/register` | Public | Register new user (member role) |
| `POST` | `/api/v1/auth/login`    | Public | Login with email + password     |

#### Flow

```
1. Register/Login
2. → Password hashed/verified (bcrypt, 10 rounds)
3. → Token pair issued (access 15m, refresh 7d)
4. → Both tokens set as httpOnly cookies
5. → Access token also returned in response body
```

#### DTOs

**RegisterDto**: `name` (2-100 chars), `email` (valid email), `password` (8-128 chars)

**LoginDto**: `email`, `password`

### 8.2 Users Module (`modules/users/`)

**Purpose**: User management and profile operations.

#### User Entity (`entity/user.entity.ts`)

| Column            | Type           | Notes                                   |
| ----------------- | -------------- | --------------------------------------- |
| `id`              | `uuid`         | Primary key, auto-generated             |
| `name`            | `varchar(100)` | Display name                            |
| `email`           | `varchar(255)` | Unique, login identifier                |
| `passwordHash`    | `varchar(255)` | `select: false` — hidden from queries   |
| `roles`           | `enum[]`       | Postgres enum array: `admin` / `member` |
| `profileImage`    | `varchar`      | Nullable, profile picture URL           |
| `termsAcceptedAt` | `timestamp`    | Nullable                                |
| `termsVersion`    | `varchar(20)`  | Nullable                                |
| `notes`           | `OneToMany`    | → `Notes`                               |
| `notifications`   | `OneToMany`    | → `Notifications`                       |
| `reminders`       | `OneToMany`    | → `Reminder`                            |
| `createdTasks`    | `OneToMany`    | → `Task.creator`                        |
| `assignedTasks`   | `OneToMany`    | → `Task.assignee`                       |
| `createdProjects` | `OneToMany`    | → `Project.creator`                     |
| `memberProjects`  | `ManyToMany`   | → `Project.members`                     |
| `taskAssignments` | `ManyToMany`   | → `Task.assignees`                      |
| `teamMemberships` | `OneToMany`    | → `TeamMember.user`                     |

#### Admin Endpoints (`UserController`, `/api/v1/users`)

| Method   | Route                   | Auth  | Description     |
| -------- | ----------------------- | ----- | --------------- |
| `GET`    | `/users`                | Admin | List all users  |
| `GET`    | `/users/:id`            | Admin | Get user by ID  |
| `POST`   | `/users`                | Admin | Create user     |
| `DELETE` | `/users/:id`            | Admin | Delete user     |
| `PATCH`  | `/users/:id/activate`   | Admin | Activate user   |
| `PATCH`  | `/users/:id/deactivate` | Admin | Deactivate user |

#### Member Endpoints (`MembersController`, `/api/v1/members`)

| Method | Route         | Auth | Description              |
| ------ | ------------- | ---- | ------------------------ |
| `GET`  | `/members/me` | Any  | Get current user profile |

### 8.3 Projects Module (`modules/projects/`)

**Purpose**: Project CRUD with creator/member access control.

#### Project Entity (`entity/project.entity.ts`)

| Column          | Type               | Notes                              |
| --------------- | ------------------ | ---------------------------------- |
| `id`            | `uuid`             | Primary key                        |
| `name`          | `varchar(150)`     | Project name (uniqueness enforced in service) |
| `description`   | `text`             | Nullable                           |
| `createdIn`     | `varchar(255)`     | Nullable                           |
| `projectStatus` | `enum`             | `open` / `closed`, default: `open` |
| `projectImage`  | `varchar`          | Nullable, cover image URL          |
| `creator`       | `ManyToOne→User`   | Project creator                    |
| `members`       | `ManyToMany→User`  | Join table: `project_members`      |
| `teams`         | `ManyToMany→Team`  | Join table: `project_teams`        |
| `tasks`         | `OneToMany→Task`   | Project's tasks                    |

#### Admin Endpoints (`ProjectsController`, `/api/v1/projects`)

| Method   | Route                           | Description                |
| -------- | ------------------------------- | -------------------------- |
| `POST`   | `/projects`                     | Create project (multipart) |
| `DELETE` | `/projects/:id`                 | Delete project             |
| `POST`   | `/projects/:id/members/:userId` | Add member to project      |
| `DELETE` | `/projects/:id/members/:userId` | Remove member from project |
| `PATCH`  | `/projects/:id/close`           | Close project              |
| `PATCH`  | `/projects/:id/reopen`          | Reopen project             |

#### Member Endpoints (`ProjectsMembersController`, `/api/v1/members`)

| Method | Route          | Description                          |
| ------ | -------------- | ------------------------------------ |
| `GET`  | `/members`     | List my projects (creator or member) |
| `GET`  | `/members/:id` | Get single project (if has access)   |

#### Access Control

- `findByUser()`: matches `creator.id` OR exists in `members` array.
- Project images: uploaded via S3 (with local fallback), `projectImage` stored as key and resolved to a signed URL on read.
- Duplicate project names rejected with `409 Conflict`.

### 8.4 Tasks Module (`modules/tasks/`)

**Purpose**: Task management with multiple image support and project-based access control.

#### Task Entity (`entity/task.entity.ts`)

| Column        | Type                    | Notes                                            |
| ------------- | ----------------------- | ------------------------------------------------ |
| `id`          | `uuid`                  | Primary key                                      |
| `title`       | `varchar(200)`          | Task title                                       |
| `description` | `text`                  | Nullable                                         |
| `status`      | `enum`                  | `todo` / `inprogress` / `done`                   |
| `priority`    | `enum`                  | `low` / `medium` / `high`                        |
| `dueDate`     | `timestamp`             | Nullable                                         |
| `completedAt` | `timestamp`             | Auto-set when status → `done`; cleared on revert |
| `project`     | `ManyToOne→Project`     | Cascade delete                                   |
| `creator`     | `ManyToOne→User`        | Task creator                                     |
| `assignee`    | `ManyToOne→User`        | Nullable assigned user                           |
| `assignees`   | `ManyToMany→User`       | Join table: `task_assignees`                     |
| `teams`       | `ManyToMany→Team`       | Join table: `task_teams`                         |
| `images`      | `OneToMany→TaskImage`   | Cascade, up to 10 per upload                     |

#### TaskImage Entity (`entity/task-image.entity.ts`)

| Column  | Type             | Notes                |
| ------- | ---------------- | -------------------- |
| `id`    | `uuid`           | Primary key          |
| `key`   | `varchar(500)`   | S3 key or local path |
| `url`   | `varchar(2000)`  | Public URL           |
| `order` | `int`            | Display order        |
| `task`  | `ManyToOne→Task` | Cascade delete       |

#### Admin Endpoints (`TasksController`, `/api/v1/tasks`)

| Method   | Route                       | Description                      |
| -------- | --------------------------- | -------------------------------- |
| `POST`   | `/tasks`                    | Create task (multipart, files[]) |
| `GET`    | `/tasks`                    | List all tasks (user's tasks)    |
| `GET`    | `/tasks/project/:projectId` | Get tasks by project             |
| `GET`    | `/tasks/:id`                | Get task by ID (any user)        |
| `PATCH`  | `/tasks/:id`                | Update task (multipart)          |
| `PATCH`  | `/tasks/:id/assign/:userId` | Assign task to user              |
| `DELETE` | `/tasks/:id/assign`         | Unassign task                    |
| `DELETE` | `/tasks/:id`                | Delete task + cleanup images     |

#### Member Endpoints (`TasksMembersController`, `/api/v1/members/tasks`)

| Method  | Route                               | Description                                     |
| ------- | ----------------------------------- | ----------------------------------------------- |
| `GET`   | `/members/tasks`                    | List my tasks (creator or assignee)             |
| `GET`   | `/members/tasks/project/:projectId` | Get tasks by project                            |
| `GET`   | `/members/tasks/:id`                | Get task by ID                                  |
| `PATCH` | `/members/tasks/:id/status`         | Update task status (assignee or project member) |

#### Access Control & Validation

| Rule                   | Enforcement                             |
| ---------------------- | --------------------------------------- |
| Create task            | User must be project creator or member  |
| Assign task            | Assignee must be project member         |
| Unassign task          | User must be project member             |
| Update/Delete task     | User must be project member             |
| Update status (member) | Must be task assignee OR project member |
| Revert from `done`     | Clears `completedAt` to `null`          |
| View task              | Any authenticated user (no restriction) |

### 8.5 Teams Module (`modules/teams/`)

**Purpose**: Team management with role-based membership (owner/admin/member) and project/task association.

#### Team Entity (`entity/teams.entity.ts`)

| Column        | Type               | Notes                              |
| ------------- | ------------------ | ---------------------------------- |
| `id`          | `uuid`             | Primary key                        |
| `name`        | `varchar(150)`     | Team name                          |
| `key`         | `varchar(20)`      | Unique team key                    |
| `description` | `text`             | Team description                   |
| `avatar`      | `varchar`          | Nullable avatar URL                |
| `creator`     | `ManyToOne→User`   | Team creator                       |
| `members`     | `OneToMany→TeamMember` | Cascade members               |
| `projects`    | `ManyToMany→Project` | Inverse side (`project_teams`)  |
| `tasks`       | `ManyToMany→Task`    | Inverse side (`task_teams`)     |

#### TeamMember Entity (`entity/teams-members.entity.ts`)

| Column    | Type               | Notes                              |
| --------- | ------------------ | ---------------------------------- |
| `id`      | `uuid`             | Primary key                        |
| `team`    | `ManyToOne→Team`   | Cascade delete                     |
| `user`    | `ManyToOne→User`   | Member user                        |
| `role`    | `enum`             | `owner` / `admin` / `member`       |
| `creator` | `ManyToOne→User`   | User who added this member         |

> **Ownership note**: The `Team ↔ Project` / `Team ↔ Task` relations are **owned by** `Project` and `Task` (via `project_teams` / `task_teams` join tables). `Team` keeps inverse `@ManyToMany` sides for read-only querying. See `docs/teams-project-task-decoupling.md`.

#### Endpoints (`TeamsController`, `/api/v1/teams` — Admin only)

| Method   | Route                                    | Description                  |
| -------- | ---------------------------------------- | ---------------------------- |
| `POST`   | `/teams`                                 | Create team                  |
| `GET`    | `/teams`                                 | List all teams               |
| `GET`    | `/teams/:id?include=projects,tasks`      | Get team (optional relations) |
| `PATCH`  | `/teams/:id`                             | Update team                  |
| `DELETE` | `/teams/:id`                             | Delete team                  |
| `PATCH`  | `/teams/:id/activate`                    | Activate team                |
| `PATCH`  | `/teams/:id/deactivate`                  | Deactivate team              |
| `POST`   | `/teams/:teamId/members`                 | Add member to team           |
| `GET`    | `/teams/:teamId/members`                 | List team members            |
| `GET`    | `/teams/:teamId/members/:memberId`       | Get a single member          |
| `DELETE` | `/teams/:teamId/members/:memberId`       | Remove member                |
| `PATCH`  | `/teams/:teamId/members/:memberId/activate`   | Activate member         |
| `PATCH`  | `/teams/:teamId/members/:memberId/deactivate` | Deactivate member       |

#### DTOs

- **CreateTeamDto**: `name`, `key`, `description`, optional `avatar`, optional `members[]` (user UUIDs).
- **UpdateTeamDto**: all fields optional (partial update).
- **AddMemberToTeamDto**: `userId` (required UUID), optional `role`.

### 8.6 Notes Module (`modules/notes/`)

**Purpose**: Personal notes with optional image attachments (scoped to the authenticated user).

#### Notes Entity (`entity/notes.entity.ts`)

| Column     | Type             | Notes                            |
| ---------- | ---------------- | -------------------------------- |
| `id`       | `uuid`           | Primary key                      |
| `user`     | `ManyToOne→User` | Owner                            |
| `title`    | `varchar(255)`   | Note title                       |
| `content`  | `text`           | Nullable                         |
| `imageKey` | `varchar(500)`   | Nullable S3/local key            |
| `imageUrl` | `varchar(2000)`  | Nullable, resolved on read       |

#### Endpoints (`NotesController`, `/api/v1/notes`)

| Method   | Route               | Description                  |
| -------- | ------------------- | ---------------------------- |
| `GET`    | `/notes`            | List my notes                |
| `GET`    | `/notes/:id`        | Get a note                   |
| `POST`   | `/notes`            | Create note (multipart)      |
| `PATCH`  | `/notes/:id`        | Update note (multipart)      |
| `DELETE` | `/notes/:id`        | Delete note                  |
| `PATCH`  | `/notes/:id/activate`   | Activate note           |
| `PATCH`  | `/notes/:id/deactivate` | Deactivate note         |

- Image upload limited to 2 MB (`FileSizeValidationPipe`).
- `imageUrl` resolved to a pre-signed URL on every read.

### 8.7 Reminders Module (`modules/reminders/`)

**Purpose**: User reminders delivered as in-app notifications via BullMQ, with recurrence and snooze support.

#### Reminder Entity (`entity/reminder.entity.ts`)

| Column            | Type          | Notes                              |
| ----------------- | ------------- | ---------------------------------- |
| `id`              | `uuid`        | Primary key                        |
| `user`            | `ManyToOne`   | Owner (cascade delete)             |
| `title`           | `varchar(150)`| Reminder title                     |
| `reminderMessage` | `text`        | Message body                       |
| `reminderAt`      | `timestamptz` | Trigger time                       |
| `repeatCount`     | `int`         | Times to repeat (default 1)        |
| `snoozeMinutes`   | `int`         | Nullable snooze interval           |
| `repeatInterval`  | `enum`        | `none`/`daily`/`weekly`/`monthly`/`custom` |
| `isSent`          | `boolean`     | Delivery flag                      |
| `isCompleted`     | `boolean`     | Done/dismissed flag                |
| `queued`          | `boolean`     | Whether a queue job is registered  |
| `nextTriggerAt`   | `timestamptz` | Next trigger for recurring/snoozed |

#### Endpoints (`RemindersController`, `/api/v1/reminders`)

| Method   | Route                      | Description                          |
| -------- | -------------------------- | ------------------------------------ |
| `GET`    | `/reminders`               | List my reminders                    |
| `GET`    | `/reminders/upcoming`      | List upcoming reminders              |
| `GET`    | `/reminders/:id`           | Get a reminder                       |
| `POST`   | `/reminders`               | Create reminder                      |
| `PATCH`  | `/reminders/:id`           | Update reminder                      |
| `PATCH`  | `/reminders/:id/reschedule`| Reschedule reminder                  |
| `PATCH`  | `/reminders/:id/toggle`    | Toggle active/inactive               |
| `PATCH`  | `/reminders/:id/acknowledge`| Mark as done                        |
| `PATCH`  | `/reminders/:id/snooze`    | Snooze by N minutes                  |
| `DELETE` | `/reminders`               | Delete all my reminders              |
| `DELETE` | `/reminders/:id`           | Delete a reminder                    |

#### Scheduling Flow

1. On startup, `RemindersService.onModuleInit()` registers a **repeatable job** `register-upcoming-reminders` on the `reminders` queue (every 6 hours, `0 */6 * * *`).
2. The `ReminderProcessor` handles three job types:
   - `send-reminder-created-confirmation` — notifies the user a reminder was created.
   - `send-reminder-notification` — fires the actual reminder notification at trigger time.
   - `register-upcoming-reminders` — scans today's due reminders and enqueues delayed `send-reminder-notification` jobs.
3. Each notification is persisted via `NotificationsService.createNotification()` with `referenceType: 'reminder'`.

### 8.8 Notifications Module (`modules/notifications/`)

**Purpose**: In-app notifications for the authenticated user.

#### Notifications Entity (`entity/notifications.entity.ts`)

| Column          | Type             | Notes                              |
| --------------- | ---------------- | ---------------------------------- |
| `id`            | `uuid`           | Primary key                        |
| `user`          | `ManyToOne→User` | Recipient (cascade delete)         |
| `type`          | `enum`           | `task_assigned` / `task_status_changed` / `project_invited` / `project_status_changed` / `general` |
| `title`         | `varchar(255)`   | Title                              |
| `message`       | `text`           | Body                               |
| `isRead`        | `boolean`        | Default `false`                    |
| `readAt`        | `timestamp`      | Nullable                           |
| `referenceId`   | `uuid`           | Nullable referenced entity id      |
| `referenceType` | `varchar(50)`    | Nullable referenced entity type    |

#### Endpoints (`NotificationsController`, `/api/v1/notifications`)

| Method   | Route                | Description                           |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/notifications`     | List my notifications                 |
| `GET`    | `/notifications/count`| Count my notifications               |
| `POST`   | `/notifications/mark-read` | Mark all as read               |
| `DELETE` | `/notifications/:id` | Delete a notification                 |
| `DELETE` | `/notifications/all` | Delete all my notifications           |

### 8.9 Dashboard Module (`modules/dashboard/`)

**Stub** — reserved for future dashboard aggregation (notes + projects + tasks). `DashboardController` has no routes yet.

---

## 9. API Routing & Endpoints

All routes are prefixed with `/api/v1/` (via URI versioning).

| Method   | Route                                        | Auth  | Module        | Description                    |
| -------- | -------------------------------------------- | ----- | ------------- | ------------------------------ |
| `POST`   | `/auth/register`                             | Public | Auth          | Register                       |
| `POST`   | `/auth/login`                                | Public | Auth          | Login                          |
| `GET`    | `/users`                                     | Admin | Users         | List users                     |
| `GET`    | `/users/:id`                                 | Admin | Users         | Get user                       |
| `POST`   | `/users`                                     | Admin | Users         | Create user                    |
| `DELETE` | `/users/:id`                                 | Admin | Users         | Delete user                    |
| `PATCH`  | `/users/:id/activate`                        | Admin | Users         | Activate user                  |
| `PATCH`  | `/users/:id/deactivate`                      | Admin | Users         | Deactivate user                |
| `GET`    | `/members/me`                                | Any   | Users         | Get current profile            |
| `POST`   | `/projects`                                  | Admin | Projects      | Create project                 |
| `DELETE` | `/projects/:id`                              | Admin | Projects      | Delete project                 |
| `POST`   | `/projects/:id/members/:userId`              | Admin | Projects      | Add project member             |
| `DELETE` | `/projects/:id/members/:userId`              | Admin | Projects      | Remove project member          |
| `PATCH`  | `/projects/:id/close`                        | Admin | Projects      | Close project                  |
| `PATCH`  | `/projects/:id/reopen`                       | Admin | Projects      | Reopen project                 |
| `GET`    | `/members`                                   | Any   | Projects      | List my projects               |
| `GET`    | `/members/:id`                               | Any   | Projects      | Get project (if access)        |
| `POST`   | `/tasks`                                     | Admin | Tasks         | Create task                    |
| `GET`    | `/tasks`                                     | Admin | Tasks         | List tasks                     |
| `GET`    | `/tasks/project/:projectId`                  | Admin | Tasks         | Tasks by project               |
| `GET`    | `/tasks/:id`                                 | Admin | Tasks         | Get task                       |
| `PATCH`  | `/tasks/:id`                                 | Admin | Tasks         | Update task                    |
| `PATCH`  | `/tasks/:id/assign/:userId`                  | Admin | Tasks         | Assign task                    |
| `DELETE` | `/tasks/:id/assign`                          | Admin | Tasks         | Unassign task                  |
| `DELETE` | `/tasks/:id`                                 | Admin | Tasks         | Delete task                    |
| `GET`    | `/members/tasks`                             | Any   | Tasks         | List my tasks                  |
| `GET`    | `/members/tasks/project/:projectId`          | Any   | Tasks         | Tasks by project               |
| `GET`    | `/members/tasks/:id`                         | Any   | Tasks         | Get task                       |
| `PATCH`  | `/members/tasks/:id/status`                  | Any   | Tasks         | Update task status             |
| `POST`   | `/teams`                                     | Admin | Teams         | Create team                    |
| `GET`    | `/teams`                                     | Admin | Teams         | List teams                     |
| `GET`    | `/teams/:id`                                 | Admin | Teams         | Get team                       |
| `PATCH`  | `/teams/:id`                                 | Admin | Teams         | Update team                    |
| `DELETE` | `/teams/:id`                                 | Admin | Teams         | Delete team                    |
| `PATCH`  | `/teams/:id/activate`                        | Admin | Teams         | Activate team                  |
| `PATCH`  | `/teams/:id/deactivate`                      | Admin | Teams         | Deactivate team                |
| `POST`   | `/teams/:teamId/members`                     | Admin | Teams         | Add team member                |
| `GET`    | `/teams/:teamId/members`                     | Admin | Teams         | List team members              |
| `GET`    | `/teams/:teamId/members/:memberId`           | Admin | Teams         | Get team member                |
| `DELETE` | `/teams/:teamId/members/:memberId`           | Admin | Teams         | Remove team member             |
| `PATCH`  | `/teams/:teamId/members/:memberId/activate`  | Admin | Teams         | Activate team member           |
| `PATCH`  | `/teams/:teamId/members/:memberId/deactivate`| Admin | Teams         | Deactivate team member         |
| `GET`    | `/notes`                                     | Any   | Notes         | List my notes                  |
| `GET`    | `/notes/:id`                                 | Any   | Notes         | Get note                       |
| `POST`   | `/notes`                                     | Any   | Notes         | Create note                    |
| `PATCH`  | `/notes/:id`                                 | Any   | Notes         | Update note                    |
| `DELETE` | `/notes/:id`                                 | Any   | Notes         | Delete note                    |
| `PATCH`  | `/notes/:id/activate`                        | Any   | Notes         | Activate note                  |
| `PATCH`  | `/notes/:id/deactivate`                      | Any   | Notes         | Deactivate note                |
| `GET`    | `/reminders`                                 | Any   | Reminders     | List my reminders              |
| `GET`    | `/reminders/upcoming`                        | Any   | Reminders     | List upcoming reminders        |
| `GET`    | `/reminders/:id`                             | Any   | Reminders     | Get reminder                   |
| `POST`   | `/reminders`                                 | Any   | Reminders     | Create reminder                |
| `PATCH`  | `/reminders/:id`                             | Any   | Reminders     | Update reminder                |
| `PATCH`  | `/reminders/:id/reschedule`                  | Any   | Reminders     | Reschedule reminder            |
| `PATCH`  | `/reminders/:id/toggle`                      | Any   | Reminders     | Toggle active                  |
| `PATCH`  | `/reminders/:id/acknowledge`                 | Any   | Reminders     | Mark done                      |
| `PATCH`  | `/reminders/:id/snooze`                      | Any   | Reminders     | Snooze                         |
| `DELETE` | `/reminders`                                 | Any   | Reminders     | Delete all reminders           |
| `DELETE` | `/reminders/:id`                             | Any   | Reminders     | Delete reminder                |
| `GET`    | `/notifications`                             | Any   | Notifications | List notifications             |
| `GET`    | `/notifications/count`                       | Any   | Notifications | Count notifications            |
| `POST`   | `/notifications/mark-read`                   | Any   | Notifications | Mark all read                  |
| `DELETE` | `/notifications/:id`                         | Any   | Notifications | Delete notification            |
| `DELETE` | `/notifications/all`                         | Any   | Notifications | Delete all notifications       |

---

## 10. Configuration & Environment

### Environment File

Single `.env` file loaded via `ConfigModule.forRoot({ isGlobal: true })`.

### Key Defaults

| Setting         | Development Default                                  |
| --------------- | ---------------------------------------------------- |
| Port            | `3000`                                               |
| Swagger         | Enabled (non-production)                             |
| Database sync   | `false` (migrations run automatically)               |
| Rate limit      | 250 req/min default, 250 req/min strict, 35/15min auth |
| JWT access TTL  | `15m`                                                |
| JWT refresh TTL | `7d`                                                 |
| Bcrypt rounds   | `10`                                                 |

---

## 11. Authentication & Authorization

### Flow

```
1. Register/Login → Token pair (access 15m + refresh 7d)
2. Both tokens set as httpOnly cookies
3. Access token also returned in response body
4. Each API request → Authorization: Bearer <access_token>
5. AuthGuard (global) → verifies access token on @Protected() routes
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
  "iss": "electro-pi-api",
  "aud": "electro-pi"
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
  "iss": "electro-pi-api",
  "aud": "electro-pi"
}
```

> The code-level fallback defaults (`JWT_DEFAULT_ISSUER` / `JWT_DEFAULT_AUDIENCE`) are `noviq-api` / `noviq-client`; `.env.example` sets `electro-pi-api` / `electro-pi`.

### Security Features

| Feature               | Implementation                                              |
| --------------------- | ----------------------------------------------------------- |
| Token type validation | `verifyAccessToken()` rejects refresh tokens                |
| Separate secrets      | Access and refresh use independent signing keys             |
| Token ID (jti)        | Each refresh token has a unique ID                          |
| Short-lived access    | 15-minute access tokens limit exposure                      |
| Helmet                | Security headers (CSP disabled for Swagger)                 |
| CORS                  | Credentialed requests, all origins                          |
| Rate limiting         | 3 tiers: default (250/min), strict (250/min), auth (35/15min) |

---

## 12. Database Schema

Managed by TypeORM migrations. Tables (in creation order):

| Table             | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `users`           | User accounts                                    |
| `projects`        | Projects                                         |
| `project_members` | Many-to-many: project ↔ members                  |
| `project_teams`   | Many-to-many: project ↔ teams                    |
| `tasks`           | Tasks                                            |
| `task_assignees`  | Many-to-many: task ↔ assignees                   |
| `task_teams`      | Many-to-many: task ↔ teams                       |
| `task_images`     | Task image attachments                           |
| `teams`           | Teams                                            |
| `team_members`    | Team membership (role, unique team+user)         |
| `notes`           | Personal notes                                   |
| `notifications`   | In-app notifications                             |
| `reminders`       | User reminders                                   |

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
  name             VARCHAR(150) NOT NULL,
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

### Table: `project_teams`

```sql
CREATE TABLE project_teams (
  "project_id" UUID REFERENCES projects(id) ON DELETE CASCADE,
  "team_id"    UUID REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY ("project_id", "team_id")
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

### Table: `teams`

```sql
CREATE TABLE teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150) NOT NULL,
  key         VARCHAR(20) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  avatar      VARCHAR NULL,
  "creator_id" UUID REFERENCES users(id),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

### Table: `team_members`

```sql
CREATE TABLE team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_id"   UUID REFERENCES teams(id) ON DELETE CASCADE,
  "user_id"   UUID REFERENCES users(id) ON DELETE CASCADE,
  role        team_members_role_enum DEFAULT 'member',
  "creator_id" UUID REFERENCES users(id),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  UNIQUE ("team_id", "user_id")
);
```

### Table: `notes`

```sql
CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"   UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  content     TEXT,
  "imageKey"  VARCHAR(500),
  "imageUrl"  VARCHAR(2000),
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

### Table: `notifications`

```sql
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     UUID REFERENCES users(id) ON DELETE CASCADE,
  type          notifications_type_enum DEFAULT 'general',
  title         VARCHAR(255) NOT NULL,
  message       TEXT NOT NULL,
  "isRead"      BOOLEAN DEFAULT false,
  "readAt"      TIMESTAMP,
  "referenceId" UUID,
  "referenceType" VARCHAR(50),
  "createdAt"   TIMESTAMP DEFAULT now(),
  "updatedAt"   TIMESTAMP DEFAULT now()
);
```

### Table: `reminders`

```sql
CREATE TABLE reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"       UUID REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(150) NOT NULL,
  "reminderMessage" TEXT NOT NULL,
  "reminderAt"    TIMESTAMPTZ NOT NULL,
  "repeatCount"   INT DEFAULT 1,
  "snoozeMinutes" INT,
  "repeatInterval" reminders_repeatinterval_enum DEFAULT 'none',
  "isSent"        BOOLEAN DEFAULT false,
  "isCompleted"   BOOLEAN DEFAULT false,
  queued          BOOLEAN DEFAULT false,
  "nextTriggerAt" TIMESTAMPTZ,
  "createdAt"     TIMESTAMP DEFAULT now(),
  "updatedAt"     TIMESTAMP DEFAULT now()
);
```

---

## 13. File Storage (S3)

### Upload Flow

```
Client
  │
  ├─ POST /projects (multipart: file)  →  UploaderService.uploadResource()
  ├─ POST /tasks (multipart: files[])  →  UploaderService.uploadResource() × N
  ├─ POST /notes (multipart: file)     →  UploaderService.uploadResource()
  │                                         ├── S3 PutObject
  │                                         └── (fail) → save to ./uploads/
  │
  ├─ GET /uploads/...                  →  Static file serving (local fallback)
  │
  └─ Read operations                   →  UploaderService.getSignedUrl()
```

### Local Disk Fallback

When S3 `PutObject` fails (IAM permission, network issue):

- File saved to `./uploads/{folder}/timestamp-filename.ext`
- URL returned as `/uploads/{folder}/...`
- Served via `app.useStaticAssets(join(cwd, 'uploads'), { prefix: '/uploads' })`
- Keys prefixed with `local:` for proper cleanup identification

### S3 Configuration

| Variable                | Default     | Description       |
| ----------------------- | ----------- | ----------------- |
| `AWS_REGION`            | `us-east-1` | AWS region        |
| `AWS_ACCESS_KEY_ID`     | —           | AWS access key    |
| `AWS_SECRET_ACCESS_KEY` | —           | AWS secret key    |
| `S3_BUCKET_NAME`        | —           | Target bucket     |
| `S3_KEY_PREFIX`         | `uploads`   | Object key prefix |

---

## 14. Background Jobs & Queues

### Queue Dashboard

Bull Board is mounted at **`/admin/queues`** and visualizes the four registered queues (`default`, `email`, `notification`, `reminders`).

### Reminders

| Job name                             | Queue      | Trigger                                  |
| ------------------------------------ | ---------- | ---------------------------------------- |
| `register-upcoming-reminders`        | `reminders`| Repeatable, every 6 hours (`0 */6 * * *`) |
| `send-reminder-notification`         | `reminders`| Delayed job (fired at `reminderAt`)      |
| `send-reminder-created-confirmation` | `reminders`| Immediately on reminder creation         |

See [Section 8.7](#87-reminders-module-modulesreminders) for the full flow.

---

## 15. Error Handling

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

| Exception               | Status | Example Message                                          |
| ----------------------- | ------ | -------------------------------------------------------- |
| `UnauthorizedException` | 401    | "Invalid email or password." / "No token provided"       |
| `ForbiddenException`    | 403    | "You do not have access to modify tasks in this project" |
| `NotFoundException`     | 404    | "Task not found" / "Project not found"                   |
| `ConflictException`     | 409    | "A project with this name already exists"                |
| `PayloadTooLargeException` | 413 | "File size exceeds 2 MB limit"                           |
| `ValidationPipe`        | 400    | Array of validation error strings                        |

---

## 16. Rate Limiting & Security

### Rate Limiting Tiers

| Tier      | Window | Limit | Applied To             |
| --------- | ------ | ----- | ---------------------- |
| `default` | 1 min  | 250   | All general API routes |
| `strict`  | 1 min  | 250   | Sensitive endpoints    |
| `auth`    | 15 min | 35    | Login / register       |

### Security Headers (Helmet)

All standard security headers applied. CSP disabled for Swagger UI compatibility.

### CORS

```typescript
{
  credentials: true,  // Allow cookies/auth headers
  origin: true        // Reflect all origins
}
```

### Validation Pipe

| Setting                      | Effect                                      |
| ---------------------------- | ------------------------------------------- |
| `whitelist: true`            | Strips unknown properties                   |
| `forbidNonWhitelisted: true` | Returns 400 on unknown properties           |
| `transform: true`            | Auto-converts types (string → number, etc.) |

---

## 17. Swagger API Documentation

- **URL**: `http://localhost:3000/docs`
- **Title**: "Electro-Pi API"
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

### Documented Modules

All controllers are documented with `@ApiTags`, `@ApiBearerAuth`, `@ApiOperation`, `@ApiResponse`, and typed request/response DTOs — including `TeamResponseDto`, `TeamMemberResponseDto`, `NoteResponseDto`, `ReminderResponseDto`, and `NotificationResponseDto`.

---

## 18. DevOps & Deployment

### Docker

**Multi-stage Dockerfile** (`node:22-alpine`):

1. **Builder stage**: `npm ci` → `npm run build`
2. **Release stage**: production deps only, runs as `node` user

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
npm run test:cov
npm run test:int      # Integration tests
npm run test:e2e      # End-to-end tests
```

### Migrations

```bash
# Generate a new migration from entity changes
npm run migration:generate

# Apply pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

---

## 19. Quick Reference — All Environment Variables

### Application

| Variable         | Default           | Description               |
| ---------------- | ----------------- | ------------------------- |
| `NODE_ENV`       | `development`     | Environment               |
| `PORT`           | `3000`            | HTTP server port          |
| `ENABLE_SWAGGER` | `true` (non-prod) | Enable Swagger at `/docs` |

### Database (PostgreSQL)

| Variable            | Default          | Description       |
| ------------------- | ---------------- | ----------------- |
| `DATABASE_HOST`     | `localhost`      | PostgreSQL host   |
| `DATABASE_PORT`     | `5432`           | PostgreSQL port   |
| `DATABASE_NAME`     | `electro_pi_dev` | Database name     |
| `DATABASE_USER`     | `postgres`       | Database username |
| `DATABASE_PASSWORD` | `postgres`       | Database password |

### Redis

| Variable           | Default      | Description           |
| ------------------ | ------------ | --------------------- |
| `REDIS_HOST`       | `localhost`  | Redis host            |
| `REDIS_PORT`       | `6379`       | Redis port            |
| `REDIS_PASSWORD`   | —            | Redis password        |
| `REDIS_DB`         | `0`          | Redis database number |
| `REDIS_KEY_PREFIX` | `electro-pi:`| Key namespace         |

### Logging

| Variable                 | Default     | Description            |
| ------------------------ | ----------- | ---------------------- |
| `LOG_LEVEL`              | `debug`     | Log level              |
| `DEFAULT_LOG_DIR`        | `./logs`    | Log directory          |
| `DEFAULT_LOG_FILE`       | `app.log`   | Log file name          |
| `DEFAULT_LOG_MAX_SIZE`   | `10m`       | Max log file size      |
| `DEFAULT_LOG_MAX_FILES`  | `5`         | Max retained log files |

### JWT

| Variable             | Default                                  | Description               |
| -------------------- | ---------------------------------------- | ------------------------- |
| `JWT_ACCESS_SECRET`  | (dev fallback)                           | Access token signing key  |
| `JWT_REFRESH_SECRET` | (dev fallback)                           | Refresh token signing key |
| `JWT_ACCESS_TTL`     | `15m`                                    | Access token lifetime     |
| `JWT_REFRESH_TTL`    | `7d`                                     | Refresh token lifetime    |
| `JWT_ISSUER`         | `electro-pi-api`                         | JWT issuer claim          |
| `JWT_AUDIENCE`       | `electro-pi`                             | JWT audience claim        |

### Queue (BullMQ)

| Variable                   | Default      | Description                 |
| -------------------------- | ------------ | --------------------------- |
| `QUEUE_REDIS_HOST`         | `localhost`  | Queue Redis host            |
| `QUEUE_REDIS_PORT`         | `6379`       | Queue Redis port            |
| `QUEUE_REDIS_PASSWORD`     | —            | Queue Redis password        |
| `QUEUE_REDIS_DB`           | `1`          | Queue Redis database        |
| `QUEUE_PREFIX`             | `electro-pi` | Queue key prefix            |
| `QUEUE_DEFAULT_ATTEMPTS`   | `3`          | Default job attempts        |
| `QUEUE_BACKOFF_DELAY_MS`   | `5000`       | Backoff delay (ms)          |
| `QUEUE_REMOVE_ON_COMPLETE` | `1000`       | Keep completed jobs         |
| `QUEUE_REMOVE_ON_FAIL`     | `5000`       | Keep failed jobs            |

### AWS S3

| Variable                        | Default     | Description                  |
| ------------------------------- | ----------- | ---------------------------- |
| `AWS_REGION`                    | `us-east-1` | AWS region                   |
| `AWS_ACCESS_KEY_ID`             | —           | AWS access key               |
| `AWS_SECRET_ACCESS_KEY`         | —           | AWS secret key               |
| `S3_BUCKET_NAME`                | —           | S3 bucket name               |
| `S3_ENDPOINT`                   | —           | Custom endpoint (MinIO)      |
| `S3_FORCE_PATH_STYLE`           | `false`     | Path-style URLs              |
| `S3_PUBLIC_BASE_URL`            | —           | CDN / public URL base        |
| `S3_SIGNED_URL_EXPIRES_SECONDS` | `900`       | Signed URL lifetime (15 min) |
| `S3_KEY_PREFIX`                 | `uploads`   | Object key prefix            |

### Email (reserved)

| Variable        | Default     | Description           |
| --------------- | ----------- | --------------------- |
| `EMAIL_HOST`    | —           | SMTP host             |
| `EMAIL_PORT`    | `587`       | SMTP port             |
| `EMAIL_USER`    | —           | SMTP username         |
| `EMAIL_PASSWORD`| —           | SMTP password         |
| `EMAIL_FROM`    | —           | From address          |
| `EMAIL_SECURE`  | `false`     | TLS flag              |

---

> **Document Version:** 2.0  
> **Generated:** 2026-08-20  
> **Repository:** `electro-pi-api` — The backend powering the Electro-Pi collaboration platform.
