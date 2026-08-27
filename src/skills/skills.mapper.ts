import type { Skill as SkillRow } from '../generated/prisma/client';
import { Skill } from './entities/skill.entity';

export function toSkill(row: SkillRow): Skill {
  return { id: row.id, name: row.name, category: row.category };
}
