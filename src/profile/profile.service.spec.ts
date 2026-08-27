import { Test } from '@nestjs/testing';

import { NotFoundError } from '../common/errors/domain.errors';
import type { Profile as ProfileRow } from '../generated/prisma/client';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

const row: ProfileRow = {
  id: 1,
  fullName: 'Иван Иванов',
  headline: 'Backend-разработчик',
  description: 'Описание',
  location: 'Москва',
  birthDate: new Date('2003-10-08'),
  availability: 'Открыт к предложениям',
};

describe('ProfileService', () => {
  const repository = {
    findProfile: jest.fn(),
    findLinks: jest.fn(),
  };

  async function buildService(): Promise<ProfileService> {
    const module = await Test.createTestingModule({
      providers: [ProfileService, { provide: ProfileRepository, useValue: repository }],
    }).compile();
    return module.get(ProfileService);
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('отдаёт имя из колонки full_name: API обязан отвечать полем name', async () => {
    repository.findProfile.mockResolvedValue(row);
    const service = await buildService();

    const profile = await service.getProfile();

    expect(profile.name).toBe('Иван Иванов');
    expect(profile).not.toHaveProperty('fullName');
  });

  it('не протаскивает наружу поля, которых нет в GraphQL-модели', async () => {
    repository.findProfile.mockResolvedValue(row);
    const service = await buildService();

    const profile = await service.getProfile();

    expect(Object.keys(profile).sort()).toEqual([
      'availability',
      'description',
      'headline',
      'id',
      'location',
      'name',
    ]);
  });

  it('бросает доменную ошибку, если база пуста', async () => {
    repository.findProfile.mockResolvedValue(null);
    const service = await buildService();

    await expect(service.getProfile()).rejects.toBeInstanceOf(NotFoundError);
  });
});
