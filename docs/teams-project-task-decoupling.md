# Plan: Decouple Project/Task Assignment from the Teams Module

## 1. Problem / Issue

The Teams module currently manages the assignment of **projects** and **tasks**
to teams. This creates several problems:

1. **Broken ManyToMany ownership.** `Team.projects` declares its own join table
   (`team_projects`) while `Project.teams` also declares a join table
   (`project_teams`). A single relationship now maps to two different join
   tables, and TypeORM cannot reliably resolve which side owns it.
   - `Team.tasks` is the inverse side (no `@JoinTable`), while `Task.teams` owns
     `task_teams` — inconsistent with the projects setup.

2. **Wrong responsibility / coupling.** Assigning a project or task to a team is
   a property of the *project* or *task* (they "belong to" a team), not of the
   team. The Teams module is forced to import `Project` and `Task` entities and
   mutate their state, coupling unrelated modules together.

3. **Mixing concerns.** `createTeam` / `updateTeam` reach into project/task
   assignment, so team creation is no longer a single-concern operation.

## 2. Proposed Solution

Move ownership of the team association into the **Projects** and **Tasks**
modules, while keeping the relation queryable from the Teams side.

- **Ownership (write)** → lives in Projects/Tasks modules.
  - `Project.teams` keeps `@JoinTable({ name: 'project_teams' })`.
  - `Task.teams` keeps `@JoinTable({ name: 'task_teams' })`.
- **Relation (read)** → stays on `Team` as inverse `@ManyToMany` (no
  `@JoinTable`), so a team can still be loaded together with its projects and
  tasks via `relations`.
- Remove `projects` / `tasks` from the Teams DTOs and service payload builder.

> **Scope note (resolves the Section 2 vs Section 4 ambiguity):** the `teamIds`
> assignment field on `CreateProjectDto` / `CreateTaskDto` is **future work**
> and is NOT part of this change. This change only does the entity/DTO/service
> cleanup on the Teams side plus the data migration. Assigning teams through the
> Projects/Tasks modules is covered in Section 4.

## 3. Changes To Apply

### 3.1 Entity layer

- **`teams.entity.ts`**
  - Remove `@JoinTable({ name: 'team_projects' })` from `projects`.
  - Keep `@ManyToMany(() => Project, (project) => project.teams)` as the
    **inverse side only**.
  - Keep `@ManyToMany(() => Task, (task) => task.teams)` as the **inverse side
    only**.
  - Remove the now-unused `JoinTable` import.

- **`project.entity.ts`**
  - Keep `@JoinTable({ name: 'project_teams' })` (it already owns the
    relation). No change to the join table decorator.
  - Ensure the inverse function reference is present:
    `@ManyToMany(() => Team, (team) => team.projects)`.

- **`task.entity.ts`**
  - Keep `@JoinTable({ name: 'task_teams' })` (it already owns the relation).
    No change to the join table decorator.
  - Ensure the inverse function reference is present:
    `@ManyToMany(() => Team, (team) => team.tasks)`.

> Note: the inverse references (`(team) => team.projects` / `(team) =>
> team.tasks`) are a single coordinated edit — they are defined once on `Team`
> (Section 3.1 first bullet) and referenced from `Project`/`Task`. There is no
> duplication of the relation definition; these bullets only confirm the owning
> sides already exist and point at `Team`.

### 3.2 DTO layer

- **`create-team.dto.ts`** — remove `projects` and `tasks` fields (and their
  `Transform` helpers). Keep `members`.
- **`update-team.dto.ts`** — remove `projects` and `tasks` fields. Keep
  `members`.

### 3.3 Service layer

- **`teams.service.ts`**
  - Remove `projects` and `tasks` from the `createTeam` payload.
  - Remove `projects` and `tasks` from `buildTeamPayload`.

### 3.4 Repo layer (required, not optional)

- **`teams.repo.ts`** — add a relation-aware fetch so team data can still be
  gathered with its associated projects/tasks. This is a hard requirement
  (Section 5.3 depends on it):

  ```ts
  findById(id, relations?: { projects?: boolean; tasks?: boolean })
  ```

  `getTeam` in `teams.service.ts` must pass through an optional `include`
  relations argument so the controller can request `projects`/`tasks`.

### 3.5 Data migration (required)

The orphaned `team_projects` table already exists in the DB (created in
`1787136807714-Migration.ts` and still altered in `1787205659284`). Removing the
`@JoinTable` decorator will NOT drop it or migrate its rows — TypeORM simply
stops touching it. A migration is required:

1. Generate a migration with `npm run migration:generate`.
2. In that migration, **copy existing rows** from `team_projects` into
   `project_teams` (deduplicated against its PK), so no existing team↔project
   links are lost:
   ```sql
   INSERT INTO "project_teams" ("project_id", "team_id")
   SELECT "projectsId", "teamsId" FROM "team_projects"
   ON CONFLICT DO NOTHING;
   ```
3. Then `DROP TABLE "team_projects"`.

If the table is confirmed empty (no data), step 2 can be skipped and the table
simply dropped.

## 4. Out of Scope (future)

- Adding `teamIds` to `CreateProjectDto` / `CreateTaskDto` (assignment moved to
  those modules in a separate change).
- Dedicated assignment endpoints such as `POST /projects/:id/teams/:teamId`.

## 5. Verification

1. Run `npm run build` / typecheck to ensure no compile errors.
2. Run `npm run migration:run` and confirm `team_projects` is dropped and
   `project_teams` contains the migrated rows.
3. Confirm `GET /teams/:id` can return projects/tasks via the new relation-aware
   `findById` (this is now a required part of Section 3.4).
