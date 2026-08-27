import { Injectable } from '@nestjs/common';

import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';
import { toProject } from './projects.mapper';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  async findByProfileId(profileId: number): Promise<Project[]> {
    const rows = await this.repository.findByProfileId(profileId);
    return rows.map(toProject);
  }
}
