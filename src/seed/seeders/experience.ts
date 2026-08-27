import { experience } from '../data/experience';
import { PROFILE_ID } from './constants';
import { resolveSkill } from './skills';
import type { SeedDb, SkillIds } from './types';

export async function seedExperience(db: SeedDb, skillIds: SkillIds): Promise<void> {
  const experienceIds: number[] = [];

  for (const [index, item] of experience.entries()) {
    const startDate = new Date(item.startDate);
    const fields = {
      position: item.position,
      endDate: item.endDate ? new Date(item.endDate) : null,
      summary: item.summary,
      sortOrder: index,
    };

    const row = await db.experience.upsert({
      where: { company_startDate: { company: item.company, startDate } },
      create: { profileId: PROFILE_ID, company: item.company, startDate, ...fields },
      update: fields,
    });
    experienceIds.push(row.id);

    const achievementIds: number[] = [];
    for (const [order, text] of item.achievements.entries()) {
      const achievement = await db.achievement.upsert({
        where: { experienceId_sortOrder: { experienceId: row.id, sortOrder: order } },
        create: { experienceId: row.id, text, sortOrder: order },
        update: { text },
      });
      achievementIds.push(achievement.id);
    }
    await db.achievement.deleteMany({
      where: { experienceId: row.id, id: { notIn: achievementIds } },
    });

    const linked = item.skills.map((name) => resolveSkill(skillIds, name));
    for (const skillId of linked) {
      await db.experienceSkill.upsert({
        where: { experienceId_skillId: { experienceId: row.id, skillId } },
        create: { experienceId: row.id, skillId },
        update: {},
      });
    }
    await db.experienceSkill.deleteMany({
      where: { experienceId: row.id, skillId: { notIn: linked } },
    });
  }

  await db.experience.deleteMany({ where: { id: { notIn: experienceIds } } });
}
