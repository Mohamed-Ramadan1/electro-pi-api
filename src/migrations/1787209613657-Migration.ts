import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateTeamProjectsToProjectTeams1787209613657
  implements MigrationInterface
{
  name = 'MigrateTeamProjectsToProjectTeams1787209613657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "project_teams" ("project_id", "team_id")
       SELECT "projectsId", "teamsId" FROM "team_projects"
       ON CONFLICT DO NOTHING`,
    );
    await queryRunner.query(`DROP TABLE "team_projects"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_projects" (
        "teamsId" uuid NOT NULL,
        "projectsId" uuid NOT NULL,
        CONSTRAINT "PK_8232f7a4b474b3e886ab0f89d2a" PRIMARY KEY ("teamsId", "projectsId")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5b9a92aa740f36adade8dc103" ON "team_projects" ("teamsId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_babf5e141982a779d3f778de57" ON "team_projects" ("projectsId")`,
    );
    await queryRunner.query(
      `INSERT INTO "team_projects" ("teamsId", "projectsId")
       SELECT "team_id", "project_id" FROM "project_teams"
       ON CONFLICT DO NOTHING`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_projects" ADD CONSTRAINT "FK_e5b9a92aa740f36adade8dc1036" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_projects" ADD CONSTRAINT "FK_babf5e141982a779d3f778de572" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
