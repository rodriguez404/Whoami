import { Injectable } from '@nestjs/common';

import type { Experience as ExperienceRow } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number): Promise<ExperienceRow[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAchievementsByExperienceIds(experienceIds: readonly number[]) {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
