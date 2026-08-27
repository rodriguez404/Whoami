import { Module } from '@nestjs/common';

import { ExperienceModule } from '../experience/experience.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';
import { SkillsModule } from '../skills/skills.module';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [PrismaModule, SkillsModule, ExperienceModule, ProjectsModule],
  providers: [ProfileResolver, ProfileService, ProfileRepository],
})
export class ProfileModule {}
