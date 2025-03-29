import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

export type HealthCheck = () => boolean | Promise<boolean>;

@Injectable()
export class HealthRegistryService {
  private readonly _livenessChecks: Record<string, HealthCheck> = {};
  private readonly _readinessChecks: Record<string, HealthCheck> = {};

  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  get livenessChecks(): HealthIndicatorFunction[] {
    return Object.entries(this._livenessChecks).map(([key, check]): HealthIndicatorFunction => {
      return async (): Promise<HealthIndicatorResult> => {
        const indicator = this.healthIndicatorService.check(key);
        return (await check()) ? indicator.up() : indicator.down();
      };
    });
  }

  get readinessChecks(): HealthIndicatorFunction[] {
    return Object.entries(this._readinessChecks).map(([key, check]): HealthIndicatorFunction => {
      return async (): Promise<HealthIndicatorResult> => {
        const indicator = this.healthIndicatorService.check(key);
        return (await check()) ? indicator.up() : indicator.down();
      };
    });
  }

  async checkLiveness(): Promise<HealthCheckResult> {
    return this.health.check(this.livenessChecks);
  }

  checkReadiness(): Promise<HealthCheckResult> {
    return this.health.check(this.readinessChecks);
  }

  addLivenessCheck(key: string, check: HealthCheck): void {
    if (key in this._livenessChecks) {
      throw new Error(`Liveness check with key "${key}" already exists`);
    }
    this._livenessChecks[key] = check;
  }

  addReadinessCheck(key: string, check: HealthCheck): void {
    if (key in this._readinessChecks) {
      throw new Error(`Readiness check with key "${key}" already exists`);
    }
    this._readinessChecks[key] = check;
  }

  removeLivenessCheck(key: string): void {
    if (!(key in this._livenessChecks)) {
      throw new Error(`Liveness check with key "${key}" does not exist`);
    }
    delete this._livenessChecks[key];
  }

  removeReadinessCheck(key: string): void {
    if (!(key in this._readinessChecks)) {
      throw new Error(`Readiness check with key "${key}" does not exist`);
    }
    delete this._readinessChecks[key];
  }
}
