import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { CORE_APPS, CoreApp } from '../config/apps.config';

const execAsync = promisify(exec);

export interface AppStatus extends CoreApp {
  status: 'online' | 'offline';
}

export interface ServiceStatus {
  name: string;
  containerName: string;
  status: 'online' | 'offline';
}

export interface FullStatus {
  apps: AppStatus[];
  services: ServiceStatus[];
}

@Injectable()
export class StatusService {
  async getAppsStatus(): Promise<AppStatus[]> {
    const runningContainers = await this.getRunningContainers();

    return CORE_APPS.map((app) => ({
      ...app,
      status: runningContainers.includes(app.containerName)
        ? 'online'
        : 'offline',
    }));
  }

  async getServicesStatus(): Promise<ServiceStatus[]> {
    const runningContainers = await this.getRunningContainers();

    const coreServices = [
      { name: 'MySQL', containerName: 'core-mysql' },
      { name: 'MinIO', containerName: 'core-minio' },
      { name: 'Meilisearch', containerName: 'core-meilisearch' },
      { name: 'Nginx', containerName: 'core-nginx' },
    ];

    return coreServices.map((service) => ({
      ...service,
      status: runningContainers.includes(service.containerName)
        ? 'online'
        : 'offline',
    }));
  }

  async getFullStatus(): Promise<FullStatus> {
    const apps = await this.getAppsStatus();
    const services = await this.getServicesStatus();

    return { apps, services };
  }

  private async getRunningContainers(): Promise<string[]> {
    try {
      // Esegue docker ps e ottiene solo i nomi dei container
      const { stdout } = await execAsync(
        'docker ps --format "{{.Names}}"',
      );

      return stdout
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
    } catch (error) {
      console.error('Errore nel controllo dei container Docker:', error);
      // Se Docker non è disponibile, ritorna array vuoto (tutti offline)
      return [];
    }
  }
}
