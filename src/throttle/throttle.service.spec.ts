import { Test, TestingModule } from '@nestjs/testing';
import { ThrottleService } from './throttle.service';

describe('ThrottleService', () => {
  let service: ThrottleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThrottleService],
    }).compile();

    service = module.get<ThrottleService>(ThrottleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
