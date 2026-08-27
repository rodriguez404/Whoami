import { Controller, Get } from '@nestjs/common';

/**
 * Единственный REST-эндпоинт в приложении: проба для docker HEALTHCHECK.
 * Всё остальное API — GraphQL. Держать пробу на GraphQL было бы неудобно:
 * оркестратору нужен простой HTTP-статус, а GraphQL всегда отвечает 200.
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok'; uptime: number } {
    return { status: 'ok', uptime: Math.floor(process.uptime()) };
  }
}
