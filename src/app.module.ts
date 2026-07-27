import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './config/common/common.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [CommonModule, ConfigModule, InfrastructureModule, ModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
