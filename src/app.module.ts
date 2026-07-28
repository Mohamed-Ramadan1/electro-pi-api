import { Module } from '@nestjs/common';

import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CommonModule } from './common/common.module';
import { ModulesModule } from './modules/modules.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, InfrastructureModule, ModulesModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
