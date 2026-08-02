import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') !== 'production';

        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/../../modules/**/entity/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
          migrationsTableName: 'typeorm_migrations',
          synchronize: false,
          autoLoadEntities: true,
          migrationsRun: true,
          logging: isDev,
          maxQueryExecutionTime: 1000,
        };
      },
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
