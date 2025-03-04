import { Test, TestingModule } from '@nestjs/testing';
import { S3CacheController } from './s3-cache.controller';

describe('S3CacheController', () => {
  let controller: S3CacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3CacheController],
    }).compile();

    controller = module.get<S3CacheController>(S3CacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
