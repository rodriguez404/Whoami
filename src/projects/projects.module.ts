import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { SkillsModule } from '../skills/skills.module';
import { ProjectsLoaders } from './projects.loaders';
import { ProjectsRepository } from './projects.repository';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { SkillProjectsResolver } from './skill-projects.resolver';

@Module({
  imports: [PrismaModule, SkillsModule],
  providers: [
    ProjectsResolver,
    SkillProjectsResolver,
    ProjectsService,
    ProjectsRepository,
    ProjectsLoaders,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
