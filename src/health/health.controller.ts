import { Controller, Get } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // Проба ходит в базу: приложение, не способное ответить на запрос, здоровым не считается.
  @Get()
  async check(): Promise<{ status: 'ok'; uptime: number }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', uptime: Math.floor(process.uptime()) };
  }
}
