import type { ExperienceData } from './types';

export const experience: ExperienceData[] = [
  {
    company: 'Independent Project',
    position: 'Backend-разработчик',
    startDate: '2026-08-01',
    endDate: null,
    summary:
      'URL-шортенер на микросервисах. Намеренно простая бизнес-логика взята как ' +
      'полигон для распределённых систем и нагрузочного тестирования.',
    achievements: [
      'Собрал сервис с распределённой архитектурой: Kafka как шина событий (с gRPC-фоллбэком), Redis для кэша, развёртывание в k3s.',
      'Нагрузочное тестирование в Grafana k6: чтение выросло с 7 000 до 16 000 RPS после кэширования, создание ссылок — с 2 400 до 2 800. Замеры на той же машине, где запущен проект, но с ограничением ресурсов контейнеров.',
      'Ссылки живут по TTL и удаляются автоматически по истечении срока.',
    ],
    skills: [
      'Go',
      'Redis',
      'Docker',
      'Grafana k6',
      'Kafka',
      'gRPC',
      'Kubernetes (k3s)',
      'Prometheus',
    ],
  },
  {
    company: 'Independent Project',
    position: 'Backend/Fullstack-разработчик',
    startDate: '2026-04-01',
    endDate: null,
    summary:
      'R-CRM — система управления взаимоотношениями с клиентами. Развёрнута и ' +
      'доступна онлайн, работает на собственном сервере.',
    achievements: [
      'Спроектировал систему прав с нуля: типизированная структура, скоупы доступа поверх feature-флагов, защита от эскалации привилегий при создании ролей.',
      'REST API на 100+ эндпоинтов, аутентификация на JWT, мультитенантность с изоляцией арендаторов через Row Level Security на уровне СУБД.',
      'Строгое разделение слоёв handler -> service -> repository, ручные миграции, rate limiting, graceful shutdown, ручной DI-контейнер.',
      'Покрыл backend unit- и интеграционными тестами: 70%+ по основным пакетам.',
      'Развернул на VDS целиком: домен, DNS, SSL, Nginx как reverse proxy, CI/CD с zero-downtime обновлением, SSH по ключам, firewall, fail2ban (фоллбэк для регрессии конфига), сбор логов с визуализацией в Grafana.',
      'Код проходил ревью сеньора с 15 годами в вебе — например, по его замечаниям дважды полностью переписывал архитектуру.',
    ],
    skills: [
      'Go',
      'PostgreSQL',
      'SQL',
      'Docker',
      'Docker Compose',
      'Nginx',
      'Linux',
      'CI/CD',
      'Настройка VDS',
      'REST API',
      'Unit- и интеграционное тестирование',
      'Grafana',
      'React',
      'TypeScript',
      'TanStack Query',
      'Vite',
    ],
  },
  {
    company: 'ООО «ДИДЖИТАЛ СОЛЮШНС»',
    position: 'Python-разработчик',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    summary: 'Асинхронный телеграм-бот для продажи eSIM.',
    achievements: [
      'Ускорил открытие каталога: раньше при каждом входе из базы разом тянулись все данные и пользователь ждал около десяти секунд — кэширование горячих справочников сделало отклик мгновенным.',
      'Интегрировал API внешнего провайдера, реализовал inline- и reply-клавиатуры, локализацию.',
    ],
    skills: ['Python', 'PostgreSQL', 'Redis'],
  },
  {
    company: 'ООО «ДИДЖИТАЛ СОЛЮШНС»',
    position: 'Frontend-разработчик',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    summary: 'Вёрстка страниц сайта пополнения Steam на TailwindCSS.',
    achievements: [],
    skills: [],
  },
];
