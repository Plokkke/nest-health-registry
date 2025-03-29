import { Controller, Get, HttpCode, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';

import { HealthRegistryService } from '@/HealthRegistryService';

@Controller({ path: '/health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private readonly service: HealthRegistryService) {}

  @Get('/startup')
  @HttpCode(HttpStatus.NO_CONTENT)
  @HealthCheck()
  async checkStartup(): Promise<void> {}

  @Get('/liveness')
  @HealthCheck()
  async checkLiveness(): Promise<HealthCheckResult> {
    return this.service.checkLiveness();
  }

  @Get('/readiness')
  @HealthCheck()
  async checkReadiness(): Promise<HealthCheckResult> {
    return this.service.checkReadiness();
  }
}
