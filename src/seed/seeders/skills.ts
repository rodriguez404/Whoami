import { skills } from '../data/skills';
import type { SeedDb, SkillIds } from './types';

export async function seedSkills(db: SeedDb): Promise<SkillIds> {
  const byName = new Map<string, number>();

  for (const [index, skill] of skills.entries()) {
    const row = await db.skill.upsert({
      where: { name: skill.name },
      create: {
        name: skill.name,
        category: skill.category,
        sortOrder: index,
        isCore: skill.isCore ?? true,
      },
      update: {
        category: skill.category,
        sortOrder: index,
        isCore: skill.isCore ?? true,
      },
    });
    byName.set(row.name, row.id);
  }

  await db.skill.deleteMany({ where: { id: { notIn: [...byName.values()] } } });
  return byName;
}

export function resolveSkill(ids: SkillIds, name: string): number {
  const id = ids.get(name);
  if (id === undefined) {
    throw new Error(`Навык "${name}" указан в связях, но отсутствует в списке навыков`);
  }
  return id;
}
