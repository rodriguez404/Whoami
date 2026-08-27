import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { groupByKey } from '../common/dataloader/group-by-key';
import { Achievement } from './entities/achievement.entity';
import { ExperienceRepository } from './experience.repository';
import { toAchievement } from './experience.mapper';

@Injectable({ scope: Scope.REQUEST })
export class ExperienceLoaders {
  readonly achievementsByExperienceId: DataLoader<number, Achievement[]>;

  constructor(private readonly repository: ExperienceRepository) {
    this.achievementsByExperienceId = new DataLoader(async (ids: readonly number[]) => {
      const rows = await this.repository.findAchievementsByExperienceIds(ids);
      return groupByKey(ids, rows, (row) => row.experienceId, toAchievement);
    });
  }
}
