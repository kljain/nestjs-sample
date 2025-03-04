import { Body, Controller, Post } from '@nestjs/common';
import { S3CacheService } from './s3-cache.service';

@Controller('cache')
export class S3CacheController {
  constructor(private readonly s3CacheService: S3CacheService) {}

  @Post('get')
  async getForKey(@Body() body: { key: string }) {
    return this.s3CacheService.get(body.key);
  }

  @Post('clear')
  async clearForKey(@Body() body: { key: string }) {
    return this.s3CacheService.clear(body.key);
  }

  @Post('reset')
  async clearAll() {
    return this.s3CacheService.clearAll();
  }
}
