import type { SkillData } from './types';

export const skills: SkillData[] = [
  { name: 'Go', category: 'LANGUAGE' },
  { name: 'Python', category: 'LANGUAGE' },
  { name: 'TypeScript', category: 'LANGUAGE' },
  { name: 'SQL', category: 'LANGUAGE' },

  { name: 'PostgreSQL', category: 'DATABASE' },
  { name: 'Redis', category: 'DATABASE' },

  { name: 'Docker', category: 'INFRA' },
  { name: 'Docker Compose', category: 'INFRA' },
  { name: 'Nginx', category: 'INFRA' },
  { name: 'Linux', category: 'INFRA' },
  { name: 'CI/CD', category: 'INFRA' },
  { name: 'Настройка VDS', category: 'INFRA' },

  { name: 'React', category: 'FRONTEND' },
  { name: 'TanStack Query', category: 'FRONTEND' },
  { name: 'Vite', category: 'FRONTEND' },

  { name: 'Git', category: 'TOOLING' },
  { name: 'REST API', category: 'TOOLING' },
  { name: 'Unit- и интеграционное тестирование', category: 'TOOLING' },
  { name: 'Grafana', category: 'TOOLING' },
  { name: 'Grafana k6', category: 'TOOLING' },

  // isCore: false — использовал в проектах, но ещё разбираюсь
  { name: 'Kafka', category: 'INFRA', isCore: false },
  { name: 'gRPC', category: 'INFRA', isCore: false },
  { name: 'Kubernetes (k3s)', category: 'INFRA', isCore: false },
  { name: 'Prometheus', category: 'TOOLING', isCore: false },
];
