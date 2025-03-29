# @plokkke/nest-health-registry

[![npm version](https://img.shields.io/npm/v/@plokkke/nest-health-registry.svg)](https://www.npmjs.com/package/@plokkke/nest-health-registry)
[![npm downloads](https://img.shields.io/npm/dm/@plokkke/nest-health-registry.svg)](https://www.npmjs.com/package/@plokkke/nest-health-registry)
[![License](https://img.shields.io/npm/l/@plokkke/nest-health-registry.svg)](https://github.com/plokkke/nest-health-registry/blob/main/LICENSE)
[![Mutation testing score](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fplokkke%2Fnest-health-registry%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/plokkke/nest-health-registry/main)
[![Coverage Status](https://coveralls.io/repos/github/plokkke/nest-health-registry/badge.svg?branch=main)](https://coveralls.io/github/plokkke/nest-health-registry?branch=main)

A powerful and flexible health check registry module for NestJS applications, built on top of `@nestjs/terminus`. This module provides a centralized way to manage and monitor the health of your application's dependencies and services.

## Features

- 🔄 Dynamic health check registration
- 🏥 Separate liveness and readiness checks
- 🚀 Easy integration with NestJS applications
- 📊 Built-in health check endpoints
- 🔍 TypeScript support
- 🧪 Comprehensive test coverage
- 🧬 100% mutation testing coverage

## Installation

```bash
npm install @plokkke/nest-health-registry
```

## Quick Start

1. Import the `HealthRegistryModule` in your app module:

```typescript
import { Module } from '@nestjs/common';
import { HealthRegistryModule } from '@plokkke/nest-health-registry';

@Module({
  imports: [HealthRegistryModule],
})
export class AppModule {}
```

2. Inject the `HealthRegistryService` where you need to add health checks:

```typescript
import { Injectable } from '@nestjs/common';
import { HealthRegistryService } from '@plokkke/nest-health-registry';

@Injectable()
export class DatabaseService {
  constructor(private readonly healthRegistry: HealthRegistryService) {
    this.healthRegistry.addLivenessCheck('database', async () => {
      // Your database health check logic here
      return true;
    });

    this.healthRegistry.addReadinessCheck('cache', async () => {
      // Your cache health check logic here
      return true;
    });
  }
}
```

## API Reference

### HealthRegistryService

#### Methods

- `addLivenessCheck(key: string, check: HealthCheck): void`
  - Adds a new liveness check
  - Throws an error if the check key already exists

- `addReadinessCheck(key: string, check: HealthCheck): void`
  - Adds a new readiness check
  - Throws an error if the check key already exists

- `removeLivenessCheck(key: string): void`
  - Removes a liveness check
  - Throws an error if the check doesn't exist

- `removeReadinessCheck(key: string): void`
  - Removes a readiness check
  - Throws an error if the check doesn't exist

- `checkLiveness(): Promise<HealthCheckResult>`
  - Runs all registered liveness checks
  - Returns the combined health check result

- `checkReadiness(): Promise<HealthCheckResult>`
  - Runs all registered readiness checks
  - Returns the combined health check result

### HealthController

The module provides a controller with the following endpoints:

- `GET /health/startup`
  - Startup health check endpoint
  - Returns 204 No Content
  - Useful for initial application health verification

- `GET /health/liveness`
  - Liveness health check endpoint
  - Returns the status of all registered liveness checks
  - Used by container orchestrators to determine if the application is running

- `GET /health/readiness`
  - Readiness health check endpoint
  - Returns the status of all registered readiness checks
  - Used to determine if the application is ready to receive traffic

## Example Response

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "cache": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "cache": {
      "status": "up"
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 