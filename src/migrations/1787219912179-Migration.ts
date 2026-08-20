import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1787219912179 implements MigrationInterface {
  name = 'Migration1787219912179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_c448616f12038bffafbeea68285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" DROP CONSTRAINT "FK_7bb64be2e8bcfa2d7917356230d"`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "title" character varying(150) NOT NULL, "description" text, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "location" character varying(255), "meetingLink" character varying(500), "theme" character varying(100), "creator_id" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5be9dba064b5a2df1d40de97c" ON "events"  ("isActive") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_members_role_enum" AS ENUM('coordinator', 'admin', 'speaker', 'attendee')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_members_status_enum" AS ENUM('pending', 'accepted', 'declined', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_members" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "role" "public"."event_members_role_enum" NOT NULL DEFAULT 'attendee', "status" "public"."event_members_status_enum" NOT NULL DEFAULT 'pending', "event_id" uuid NOT NULL, "user_id" uuid NOT NULL, "creator_id" uuid NOT NULL, CONSTRAINT "PK_d513d28092c89e6a40aa34a5a0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50e81aae9c5def97c24db79d9c" ON "event_members"  ("isActive") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6cd670d6f3a6c8b42f43b251cd" ON "event_members"  ("event_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" DROP CONSTRAINT "FK_b5729113570c20c7e214cf3f58d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_8e02f911192897094a081e6823b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" DROP CONSTRAINT "FK_da6a05ca90d1247c2cc5c99ef0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_0141288f2306f20da9a60ec8d69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" DROP CONSTRAINT "FK_da5a226d4f7f5d3ad588304bf2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_4b86fad39217ca10aace123c7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" DROP CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_855d484825b715c545349212c7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_f4cb489461bc751498a28852356"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" DROP CONSTRAINT "FK_586e0b8e419125be507701cee2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_42744d21c558ffeb2b57a1f6a1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_1a947faf03c819d736cad655ac8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_c2bf4967c8c2a6b845dadfbf3d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_bb8051e376a2b083e074678cb60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_c2bf4967c8c2a6b845dadfbf3d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_1a947faf03c819d736cad655ac8" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_42744d21c558ffeb2b57a1f6a1a" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_4b86fad39217ca10aace123c7bd" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ADD CONSTRAINT "FK_da6a05ca90d1247c2cc5c99ef0a" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_f4cb489461bc751498a28852356" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_855d484825b715c545349212c7f" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ADD CONSTRAINT "FK_586e0b8e419125be507701cee2a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_39f98b48445861611ea17108071" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" ADD CONSTRAINT "FK_10c092b944dc7ec4589f86de9cb" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" ADD CONSTRAINT "FK_d428fa2fcb5c4d17598284064b8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" ADD CONSTRAINT "FK_6ee4c99eacc4ace080de5bc6ef7" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_b5729113570c20c7e214cf3f58d" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_8e02f911192897094a081e6823b" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_c448616f12038bffafbeea68285" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_0141288f2306f20da9a60ec8d69" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_bb8051e376a2b083e074678cb60" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" ADD CONSTRAINT "FK_da5a226d4f7f5d3ad588304bf2c" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" ADD CONSTRAINT "FK_7bb64be2e8bcfa2d7917356230d" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_teams" DROP CONSTRAINT "FK_7bb64be2e8bcfa2d7917356230d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" DROP CONSTRAINT "FK_da5a226d4f7f5d3ad588304bf2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_bb8051e376a2b083e074678cb60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_0141288f2306f20da9a60ec8d69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_c448616f12038bffafbeea68285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" DROP CONSTRAINT "FK_8e02f911192897094a081e6823b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" DROP CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" DROP CONSTRAINT "FK_b5729113570c20c7e214cf3f58d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" DROP CONSTRAINT "FK_6ee4c99eacc4ace080de5bc6ef7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" DROP CONSTRAINT "FK_d428fa2fcb5c4d17598284064b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_members" DROP CONSTRAINT "FK_10c092b944dc7ec4589f86de9cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_39f98b48445861611ea17108071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" DROP CONSTRAINT "FK_586e0b8e419125be507701cee2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_855d484825b715c545349212c7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_f4cb489461bc751498a28852356"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" DROP CONSTRAINT "FK_da6a05ca90d1247c2cc5c99ef0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_4b86fad39217ca10aace123c7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_42744d21c558ffeb2b57a1f6a1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_1a947faf03c819d736cad655ac8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_c2bf4967c8c2a6b845dadfbf3d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_bb8051e376a2b083e074678cb60" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_c2bf4967c8c2a6b845dadfbf3d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_1a947faf03c819d736cad655ac8" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_42744d21c558ffeb2b57a1f6a1a" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ADD CONSTRAINT "FK_586e0b8e419125be507701cee2a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_f4cb489461bc751498a28852356" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_855d484825b715c545349212c7f" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_4b86fad39217ca10aace123c7bd" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminders" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_teams" ADD CONSTRAINT "FK_da5a226d4f7f5d3ad588304bf2c" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_0141288f2306f20da9a60ec8d69" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ADD CONSTRAINT "FK_da6a05ca90d1247c2cc5c99ef0a" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_images" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_8e02f911192897094a081e6823b" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_members" ADD CONSTRAINT "FK_b5729113570c20c7e214cf3f58d" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_fdad7d5768277e60c40e01cdcea" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6cd670d6f3a6c8b42f43b251cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_50e81aae9c5def97c24db79d9c"`,
    );
    await queryRunner.query(`DROP TABLE "event_members"`);
    await queryRunner.query(`DROP TYPE "public"."event_members_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."event_members_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5be9dba064b5a2df1d40de97c"`,
    );
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(
      `ALTER TABLE "task_teams" ADD CONSTRAINT "FK_7bb64be2e8bcfa2d7917356230d" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_teams" ADD CONSTRAINT "FK_c448616f12038bffafbeea68285" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
