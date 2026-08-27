import { Injectable } from '@nestjs/common';

import type { Skill as SkillRow } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<SkillRow[]> {
    return this.prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  // Батч для DataLoader: один запрос на всех родителей вместо запроса на каждого.
  findByExperienceIds(experienceIds: readonly number[]) {
    return this.prisma.experienceSkill.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      include: { skill: true },
      orderBy: { skill: { sortOrder: 'asc' } },
    });
  }

  findByProjectIds(projectIds: readonly number[]) {
    return this.prisma.projectSkill.findMany({
      where: { projectId: { in: [...projectIds] } },
      include: { skill: true },
      orderBy: { skill: { sortOrder: 'asc' } },
    });
  }
}
