import { INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthModule } from '@/HealthModule';

@Module({
  imports: [HealthModule],
})
class AppModule {}

export let APP: INestApplication;

beforeAll(async () => {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    APP = moduleFixture.createNestApplication({ bodyParser: false });

    await APP.init();
  } catch (e) {
    console.error(e);
    throw e;
  }
});

afterAll(async () => {
  await APP.close();
});
