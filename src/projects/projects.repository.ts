import { Injectable } from '@nestjs/common';

import type { Project as ProjectRow } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number): Promise<ProjectRow[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findHighlightsByProjectIds(projectIds: readonly number[]) {
    return this.prisma.projectHighlight.findMany({
      where: { projectId: { in: [...projectIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findBySkillIds(skillIds: readonly number[]) {
    return this.prisma.projectSkill.findMany({
      where: { skillId: { in: [...skillIds] } },
      include: { project: true },
      orderBy: { project: { sortOrder: 'asc' } },
    });
  }
}
