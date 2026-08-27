import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { groupByKey } from '../common/dataloader/group-by-key';
import { Skill } from './entities/skill.entity';
import { toSkill } from './skills.mapper';
import { SkillsRepository } from './skills.repository';

// Scope.REQUEST обязателен: кэш DataLoader живёт ровно один запрос, иначе
// ответы залипали бы между запросами и память росла бы бесконечно.
@Injectable({ scope: Scope.REQUEST })
export class SkillsLoaders {
  readonly byExperienceId: DataLoader<number, Skill[]>;
  readonly byProjectId: DataLoader<number, Skill[]>;

  constructor(private readonly repository: SkillsRepository) {
    this.byExperienceId = new DataLoader(async (ids: readonly number[]) => {
      const rows = await this.repository.findByExperienceIds(ids);
      return groupByKey(
        ids,
        rows,
        (row) => row.experienceId,
        (row) => toSkill(row.skill),
      );
    });

    this.byProjectId = new DataLoader(async (ids: readonly number[]) => {
      const rows = await this.repository.findByProjectIds(ids);
      return groupByKey(
        ids,
        rows,
        (row) => row.projectId,
        (row) => toSkill(row.skill),
      );
    });
  }
}
