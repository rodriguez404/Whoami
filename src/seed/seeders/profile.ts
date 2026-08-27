import { getProfile } from '../data/profile';
import { PROFILE_ID } from './constants';
import type { SeedDb } from './types';

export async function seedProfile(db: SeedDb): Promise<void> {
  const data = getProfile();
  const fields = {
    fullName: data.fullName,
    headline: data.headline,
    description: data.description,
    location: data.location,
    birthDate: new Date(data.birthDate),
    availability: data.availability,
  };

  await db.profile.upsert({
    where: { id: PROFILE_ID },
    create: { id: PROFILE_ID, ...fields },
    update: fields,
  });

  const linkIds: number[] = [];
  for (const [index, link] of data.links.entries()) {
    const row = await db.socialLink.upsert({
      where: { profileId_kind: { profileId: PROFILE_ID, kind: link.kind } },
      create: { profileId: PROFILE_ID, ...link, sortOrder: index },
      update: { url: link.url, label: link.label, sortOrder: index },
    });
    linkIds.push(row.id);
  }

  await db.socialLink.deleteMany({ where: { id: { notIn: linkIds } } });
}
