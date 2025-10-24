import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async getStatus() {
    return this.statusService.getFullStatus();
  }

  @Get('apps')
  async getApps() {
    return this.statusService.getAppsStatus();
  }

  @Get('services')
  async getServices() {
    return this.statusService.getServicesStatus();
  }
}
