import type { ProjectData } from './types';

export const projects: ProjectData[] = [
  {
    slug: 'example-crm',
    name: 'Пример CRM',
    summary: 'Заглушка описания проекта.',
    url: 'https://example.com',
    repoUrl: null,
    kind: 'PRODUCT',
    isFeatured: true,
    highlights: ['Заглушка пункта раз', 'Заглушка пункта два'],
    skills: ['Go', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'example-game',
    name: 'Пример геймдев-проекта',
    summary: 'Заглушка описания проекта.',
    url: 'https://example.com',
    repoUrl: null,
    kind: 'GAMEDEV',
    isFeatured: false,
    highlights: ['Заглушка пункта'],
    skills: ['Git'],
  },
];
