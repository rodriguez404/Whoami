import { Test } from '@nestjs/testing';

import { ExperienceService } from '../experience/experience.service';
import type { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { SkillsService } from '../skills/skills.service';
import type { Profile } from './entities/profile.entity';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

const profile = { id: 1 } as Profile;

const projects: Project[] = [
  {
    id: 1,
    name: 'Витрина',
    summary: '',
    url: null,
    repoUrl: null,
    kind: 'PRODUCT',
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Кастомка',
    summary: '',
    url: null,
    repoUrl: null,
    kind: 'GAMEDEV',
    isFeatured: false,
  },
];

describe('ProfileResolver.projects', () => {
  const projectsService = { findByProfileId: jest.fn() };

  async function buildResolver(): Promise<ProfileResolver> {
    const module = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        { provide: ProfileService, useValue: {} },
        { provide: SkillsService, useValue: {} },
        { provide: ExperienceService, useValue: {} },
        { provide: ProjectsService, useValue: projectsService },
      ],
    }).compile();
    return module.get(ProfileResolver);
  }

  beforeEach(() => {
    jest.resetAllMocks();
    projectsService.findByProfileId.mockResolvedValue(projects);
  });

  it('без аргументов возвращает все проекты', async () => {
    const resolver = await buildResolver();
    await expect(resolver.projects(profile)).resolves.toHaveLength(2);
  });

  it('featured: true оставляет только избранные', async () => {
    const resolver = await buildResolver();
    const result = await resolver.projects(profile, undefined, true);
    expect(result.map((p) => p.name)).toEqual(['Витрина']);
  });

  it('featured: false оставляет только неизбранные', async () => {
    const resolver = await buildResolver();
    const result = await resolver.projects(profile, undefined, false);
    expect(result.map((p) => p.name)).toEqual(['Кастомка']);
  });

  // явный null означает "фильтр не нужен"
  it('featured: null не фильтрует, а не отсекает всё', async () => {
    const resolver = await buildResolver();
    await expect(resolver.projects(profile, undefined, null)).resolves.toHaveLength(2);
  });

  it('kind фильтрует по категории, а null его не включает', async () => {
    const resolver = await buildResolver();
    await expect(resolver.projects(profile, 'GAMEDEV')).resolves.toHaveLength(1);
    await expect(resolver.projects(profile, null)).resolves.toHaveLength(2);
  });

  it('выбирает проекты того профиля, который пришёл родителем', async () => {
    const resolver = await buildResolver();
    await resolver.projects(profile);
    expect(projectsService.findByProfileId).toHaveBeenCalledWith(1);
  });
});
