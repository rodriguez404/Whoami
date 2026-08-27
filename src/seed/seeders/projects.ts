import { projects } from '../data/projects';
import { PROFILE_ID } from './constants';
import { resolveSkill } from './skills';
import type { SeedDb, SkillIds } from './types';

export async function seedProjects(db: SeedDb, skillIds: SkillIds): Promise<void> {
  const projectIds: number[] = [];

  for (const [index, item] of projects.entries()) {
    const fields = {
      name: item.name,
      summary: item.summary,
      url: item.url,
      repoUrl: item.repoUrl,
      kind: item.kind,
      isFeatured: item.isFeatured,
      sortOrder: index,
    };

    const row = await db.project.upsert({
      where: { slug: item.slug },
      create: { profileId: PROFILE_ID, slug: item.slug, ...fields },
      update: fields,
    });
    projectIds.push(row.id);

    const highlightIds: number[] = [];
    for (const [order, text] of item.highlights.entries()) {
      const highlight = await db.projectHighlight.upsert({
        where: { projectId_sortOrder: { projectId: row.id, sortOrder: order } },
        create: { projectId: row.id, text, sortOrder: order },
        update: { text },
      });
      highlightIds.push(highlight.id);
    }
    await db.projectHighlight.deleteMany({
      where: { projectId: row.id, id: { notIn: highlightIds } },
    });

    const linked = item.skills.map((name) => resolveSkill(skillIds, name));
    for (const skillId of linked) {
      await db.projectSkill.upsert({
        where: { projectId_skillId: { projectId: row.id, skillId } },
        create: { projectId: row.id, skillId },
        update: {},
      });
    }
    await db.projectSkill.deleteMany({
      where: { projectId: row.id, skillId: { notIn: linked } },
    });
  }

  await db.project.deleteMany({ where: { id: { notIn: projectIds } } });
}
