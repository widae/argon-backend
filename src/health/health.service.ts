import { Injectable } from '@nestjs/common';
import { Health } from './health.model';

@Injectable()
export class HealthService {
  check(): Health {
    return { status: 'ok' };
  }
}
