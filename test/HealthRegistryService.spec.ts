import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

import { getError } from '?/utils';

import { HealthRegistryService } from '@/HealthRegistryService';
@Module({
  imports: [TerminusModule],
  providers: [HealthRegistryService],
  exports: [HealthRegistryService],
})
export class TestHealthModule {}

async function checkCompute(checks: (() => Promise<unknown> | unknown)[]): Promise<unknown[]> {
  return Promise.allSettled(checks.map((c) => c()));
}

describe('Health service tests suite', () => {
  let service: HealthRegistryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestHealthModule],
    }).compile();

    service = moduleRef.get<HealthRegistryService>(HealthRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addLivenessCheck', () => {
    it('should add a liveness check', () => {
      service.addLivenessCheck('test', () => true);
      expect(service['_livenessChecks']).toHaveProperty('test', expect.any(Function));
    });

    it('should throw an error if the check is already registered', async () => {
      service.addLivenessCheck('test', () => true);
      const error = await getError(() => service.addLivenessCheck('test', () => true));

      expect(error).toBeInstanceOf(Error);
      const err = error as Error;
      expect(err.message).toBe('Liveness check with key "test" already exists');
    });
  });

  describe('addReadinessCheck', () => {
    it('should add a readiness check', () => {
      service.addReadinessCheck('test', () => true);
      expect(service['_readinessChecks']).toHaveProperty('test', expect.any(Function));
    });

    it('should throw an error if the check is already registered', async () => {
      service.addReadinessCheck('test', () => true);
      const error = await getError(() => service.addReadinessCheck('test', () => true));

      expect(error).toBeInstanceOf(Error);
      const err = error as Error;
      expect(err.message).toBe('Readiness check with key "test" already exists');
    });
  });

  describe('removeLivenessCheck', () => {
    it('should remove a liveness check', async () => {
      service.addLivenessCheck('test', () => true);
      await service.removeLivenessCheck('test');
      expect(service['_livenessChecks']).not.toHaveProperty('test');
    });

    it('should throw an error if the check does not exist', async () => {
      const error = await getError(() => service.removeLivenessCheck('test'));
      expect(error).toBeInstanceOf(Error);
      const err = error as Error;
      expect(err.message).toBe('Liveness check with key "test" does not exist');
    });
  });

  describe('removeReadinessCheck', () => {
    it('should remove a readiness check', async () => {
      service.addReadinessCheck('test', () => true);
      await service.removeReadinessCheck('test');
      expect(service['_readinessChecks']).not.toHaveProperty('test');
    });

    it('should throw an error if the check does not exist', async () => {
      const error = await getError(() => service.removeReadinessCheck('test'));
      expect(error).toBeInstanceOf(Error);
      const err = error as Error;
      expect(err.message).toBe('Readiness check with key "test" does not exist');
    });
  });

  describe('livenessChecks', () => {
    it('should return the liveness checks succeeded', async () => {
      service.addLivenessCheck('test1', () => Promise.resolve(true));
      service.addLivenessCheck('test2', () => Promise.resolve(true));
      service.addLivenessCheck('test3', () => Promise.resolve(true));
      const checks = service.livenessChecks;
      expect(checks).toHaveLength(3);
      expect(await checkCompute(checks)).toStrictEqual([
        { status: 'fulfilled', value: { test1: { status: 'up' } } },
        { status: 'fulfilled', value: { test2: { status: 'up' } } },
        { status: 'fulfilled', value: { test3: { status: 'up' } } },
      ]);
    });

    it('should return the liveness checks failed', async () => {
      service.addLivenessCheck('test1', () => Promise.resolve(true));
      service.addLivenessCheck('test2', () => Promise.resolve(false));
      service.addLivenessCheck('test3', () => Promise.resolve(true));
      const checks = service.livenessChecks;
      expect(checks).toHaveLength(3);
      expect(await checkCompute(checks)).toStrictEqual([
        { status: 'fulfilled', value: { test1: { status: 'up' } } },
        { status: 'fulfilled', value: { test2: { status: 'down' } } },
        { status: 'fulfilled', value: { test3: { status: 'up' } } },
      ]);
    });
  });

  describe('readinessChecks', () => {
    it('should return the readiness checks succeeded', async () => {
      service.addReadinessCheck('test1', () => Promise.resolve(true));
      service.addReadinessCheck('test2', () => Promise.resolve(true));
      service.addReadinessCheck('test3', () => Promise.resolve(true));
      const checks = service.readinessChecks;
      expect(checks).toHaveLength(3);
      expect(await checkCompute(checks)).toStrictEqual([
        { status: 'fulfilled', value: { test1: { status: 'up' } } },
        { status: 'fulfilled', value: { test2: { status: 'up' } } },
        { status: 'fulfilled', value: { test3: { status: 'up' } } },
      ]);
    });

    it('should return the readiness checks failed', async () => {
      service.addReadinessCheck('test1', () => Promise.resolve(true));
      service.addReadinessCheck('test2', () => Promise.resolve(false));
      service.addReadinessCheck('test3', () => Promise.resolve(true));
      const checks = service.readinessChecks;
      expect(checks).toHaveLength(3);
      expect(await checkCompute(checks)).toStrictEqual([
        { status: 'fulfilled', value: { test1: { status: 'up' } } },
        { status: 'fulfilled', value: { test2: { status: 'down' } } },
        { status: 'fulfilled', value: { test3: { status: 'up' } } },
      ]);
    });
  });
});
