import { Injectable } from '@nestjs/common';

import { NotFoundError } from '../common/errors/domain.errors';

import type {
  Profile as ProfileRow,
  SocialLink as SocialLinkRow,
} from '../generated/prisma/client';
import { Profile } from './entities/profile.entity';
import { SocialLink } from './entities/social-link.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(): Promise<Profile> {
    const row = await this.repository.findProfile();
    if (!row) {
      throw new NotFoundError('Профиль не найден: база не заполнена');
    }
    return toProfile(row);
  }

  async getLinks(profileId: number): Promise<SocialLink[]> {
    const rows = await this.repository.findLinks(profileId);
    return rows.map(toSocialLink);
  }
}

// Модель Prisma наружу не отдаём: имена полей API задаются схемой GraphQL,
// а не структурой таблицы.
function toSocialLink(row: SocialLinkRow): SocialLink {
  return { id: row.id, kind: row.kind, url: row.url, label: row.label };
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.fullName,
    headline: row.headline,
    description: row.description,
    location: row.location,
    availability: row.availability,
  };
}
