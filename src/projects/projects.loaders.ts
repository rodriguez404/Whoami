import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';

import { groupByKey } from '../common/dataloader/group-by-key';
import { Project } from './entities/project.entity';
import { ProjectHighlight } from './entities/project-highlight.entity';
import { ProjectsRepository } from './projects.repository';
import { toProject, toProjectHighlight } from './projects.mapper';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsLoaders {
  readonly highlightsByProjectId: DataLoader<number, ProjectHighlight[]>;
  readonly projectsBySkillId: DataLoader<number, Project[]>;

  constructor(private readonly repository: ProjectsRepository) {
    this.highlightsByProjectId = new DataLoader(async (ids: readonly number[]) => {
      const rows = await this.repository.findHighlightsByProjectIds(ids);
      return groupByKey(ids, rows, (row) => row.projectId, toProjectHighlight);
    });

    this.projectsBySkillId = new DataLoader(async (ids: readonly number[]) => {
      const rows = await this.repository.findBySkillIds(ids);
      return groupByKey(
        ids,
        rows,
        (row) => row.skillId,
        (row) => toProject(row.project),
      );
    });
  }
}
