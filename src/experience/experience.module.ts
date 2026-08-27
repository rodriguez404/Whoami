import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SkillsModule } from '../skills/skills.module';
import { ExperienceLoaders } from './experience.loaders';
import { ExperienceRepository } from './experience.repository';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  imports: [PrismaModule, SkillsModule],
  providers: [ExperienceResolver, ExperienceService, ExperienceRepository, ExperienceLoaders],
  exports: [ExperienceService],
})
export class ExperienceModule {}
