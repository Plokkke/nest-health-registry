import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './HealthController';
import { HealthRegistryService } from './HealthRegistryService';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
  providers: [HealthRegistryService],
  exports: [HealthRegistryService],
})
export class HealthModule {}
