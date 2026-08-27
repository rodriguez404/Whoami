import { Injectable } from '@nestjs/common';

import { Skill } from './entities/skill.entity';
import { toSkill } from './skills.mapper';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  async findAll(): Promise<Skill[]> {
    const rows = await this.repository.findAll();
    return rows.map(toSkill);
  }
}
