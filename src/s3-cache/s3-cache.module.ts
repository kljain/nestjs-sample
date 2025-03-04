import { Module } from '@nestjs/common';
import { S3CacheService } from './s3-cache.service';
import { S3CacheController } from './s3-cache.controller';

@Module({
  providers: [S3CacheService],
  exports: [S3CacheService],
  controllers: [S3CacheController],
})
export class S3CacheModule {}
