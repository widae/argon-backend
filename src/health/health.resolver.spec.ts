import { Test } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthResolver } from './health.resolver';
import { Health } from './health.model';

describe('HealthResolver', () => {
  let healthResolver: HealthResolver;
  let healthService: HealthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HealthResolver, HealthService],
    }).compile();

    healthResolver = moduleRef.get<HealthResolver>(HealthResolver);
    healthService = moduleRef.get<HealthService>(HealthService);
  });

  describe('health', () => {
    it('#0', () => {
      const result: Health = { status: 'ok' };
      jest.spyOn(healthService, 'check').mockImplementation(() => result);
      expect(healthResolver.health()).toBe(result);
    });
  });
});
