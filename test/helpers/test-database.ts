import testDataSource, {
  testDataSourceOptions,
} from '../../src/infrastructure/database/data-source-test';
import { DataSource } from 'typeorm';

let dataSource: DataSource | null = null;

export async function setupTestDatabase(): Promise<DataSource> {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  const adminDs = new DataSource({
    ...testDataSourceOptions,
    database: 'postgres',
  } as any);
  await adminDs.initialize();

  const dbName = testDataSourceOptions.database as string;
  const exists = await adminDs.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );

  if (exists.length === 0) {
    await adminDs.query(`CREATE DATABASE "${dbName}"`);
  }
  await adminDs.destroy();

  dataSource = testDataSource;
  await dataSource.initialize();
  await dataSource.runMigrations();
  return dataSource;
}

export async function teardownTestDatabase(): Promise<void> {
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
  }
}

export async function clearTables(): Promise<void> {
  if (!dataSource?.isInitialized) return;
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.query(
    `TRUNCATE TABLE project_members, task_images, tasks, projects, users RESTART IDENTITY CASCADE`,
  );
  await queryRunner.release();
}
