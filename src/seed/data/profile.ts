import type { ProfileData } from './types';

// Функция, а не константа: значения читаются из окружения, а .env грузится
// уже после того, как все импорты разрешились.
export function getProfile(): ProfileData {
  return {
    fullName: process.env.PROFILE_FULL_NAME ?? 'Имя Фамилия',
    headline: 'Backend-разработчик',
    description: 'Заглушка описания. Реальный текст появится вместе с контентом.',
    location: 'Москва',
    birthDate: '2003-10-08',
    availability: 'Открыт к предложениям',
    links: [
      {
        kind: 'GITHUB',
        url: process.env.PROFILE_GITHUB_URL ?? 'https://github.com/example',
        label: 'GitHub',
      },
      {
        kind: 'TELEGRAM',
        url: process.env.PROFILE_TELEGRAM_URL ?? 'https://t.me/example',
        label: 'Telegram',
      },
      {
        kind: 'EMAIL',
        url: `mailto:${process.env.PROFILE_EMAIL ?? 'example@example.com'}`,
        label: 'Почта',
      },
    ],
  };
}
