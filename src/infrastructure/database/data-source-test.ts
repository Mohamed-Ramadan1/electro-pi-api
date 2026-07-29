import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: '.env.test' });

export const testDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'myuser',
  password: process.env.DATABASE_PASSWORD || '123456',
  database: process.env.DATABASE_NAME || 'elector_pi_test',
  entities: [resolve(__dirname, '../../modules/**/entity/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, '../../migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: false,
};

const testDataSource = new DataSource(testDataSourceOptions);

export default testDataSource;
