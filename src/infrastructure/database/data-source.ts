import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config();

const isDev = process.env.NODE_ENV !== 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'electro_pi_dev',
  entities: [resolve(__dirname, '../../modules/**/entity/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, '../../migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: isDev,
  maxQueryExecutionTime: 1000,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
