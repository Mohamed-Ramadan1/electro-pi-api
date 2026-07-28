import { Module } from '@nestjs/common';

import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CommonModule } from './common/common.module';
import { ModulesModule } from './modules/modules.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [InfrastructureModule, ModulesModule, CommonModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
