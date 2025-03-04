import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config/app-config.service';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  constructor(private readonly appConfigService: AppConfigService) {}
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return this.appConfigService.env === 'development';
  }
}
