import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app-config/app-config.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'OK';
  }
  @Get('version')
  version(): string {
    return this.appConfigService.version;
  }
}
