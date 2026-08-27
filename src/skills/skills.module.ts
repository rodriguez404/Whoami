import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SkillsLoaders } from './skills.loaders';
import { SkillsRepository } from './skills.repository';
import { SkillsService } from './skills.service';

@Module({
  imports: [PrismaModule],
  providers: [SkillsService, SkillsRepository, SkillsLoaders],
  exports: [SkillsService, SkillsLoaders],
})
export class SkillsModule {}
