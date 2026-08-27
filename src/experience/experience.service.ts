import { Injectable } from '@nestjs/common';

import { Experience } from './entities/experience.entity';
import { ExperienceRepository } from './experience.repository';
import { toExperience } from './experience.mapper';

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  async findByProfileId(profileId: number): Promise<Experience[]> {
    const rows = await this.repository.findByProfileId(profileId);
    return rows.map(toExperience);
  }
}
