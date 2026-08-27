import { Injectable } from '@nestjs/common';

import type { Profile as ProfileRow } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProfile(): Promise<ProfileRow | null> {
    return this.prisma.profile.findFirst();
  }

  findLinks(profileId: number) {
    return this.prisma.socialLink.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
