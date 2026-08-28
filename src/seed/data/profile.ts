import type { ProfileData } from './types';

// Пустая строка это тоже "не задано": compose подставляет ${VAR:-} для
// переменных, которых нет в .env.
function env(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

export function getProfile(): ProfileData {
  return {
    fullName: env('PROFILE_FULL_NAME', 'Имя Фамилия'),
    headline: 'Backend-разработчик',
    description:
      'Довожу проекты до продакшена целиком: схема базы, слои приложения, тесты, ' +
      'деплой на собственный сервер с CI/CD и сбором логов. Отдельно интересны ' +
      'производительность и нагрузочное тестирование. Быстро вхожу в чужую кодовую ' +
      'базу — разбираю, рефакторю, дорабатываю.',
    location: 'Москва',
    birthDate: '2003-10-08',
    availability: 'Открыт к предложениям: офис, удалённо или гибрид',
    links: [
      {
        kind: 'GITHUB',
        url: env('PROFILE_GITHUB_URL', 'https://github.com/example'),
        label: 'GitHub',
      },
      {
        kind: 'TELEGRAM',
        url: env('PROFILE_TELEGRAM_URL', 'https://t.me/example'),
        label: 'Telegram',
      },
      {
        kind: 'EMAIL',
        url: `mailto:${env('PROFILE_EMAIL', 'example@example.com')}`,
        label: 'Почта',
      },
    ],
  };
}
