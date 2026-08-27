process.env.NODE_ENV = 'test';

import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

interface GraphqlError {
  message: string;
  extensions: Record<string, unknown>;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlError[];
}

interface ProfileShape {
  profile: {
    name: string;
    description: string;
    links?: { url: string }[];
    skills: { name: string }[];
    experience: { company: string; position?: string }[];
    projects: { name: string }[];
  };
}

const TASK_QUERY = `query {
  profile {
    name
    description
    skills { name }
    experience { company position }
    projects { name }
  }
}`;

const DEEP_QUERY = `query {
  profile {
    name
    links { url }
    skills { name }
    experience { company skills { name } achievements { text } }
    projects { name skills { name } highlights { text } }
  }
}`;

const TOO_DEEP_QUERY = `{
  profile { experience { skills { projects { skills { projects {
    skills { projects { skills { projects { name } } } } } } } } } }
}`;

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;
  let queries: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();

    const prisma = moduleRef.get(PrismaService, { strict: false });
    prisma.$on('query', (event) => queries.push(event.query));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    queries = [];
  });

  function post(query: string) {
    return request(app.getHttpServer() as Server)
      .post('/graphql')
      .send({ query });
  }

  it('отвечает на запрос из текста задания без единой правки', async () => {
    const response = await post(TASK_QUERY).expect(200);
    const body = response.body as GraphqlResponse<ProfileShape>;

    expect(body.errors).toBeUndefined();
    expect(body.data?.profile.name).toEqual(expect.any(String));
    expect(body.data?.profile.skills.length).toBeGreaterThan(0);
    expect(body.data?.profile.experience.length).toBeGreaterThan(0);
    expect(body.data?.profile.projects.length).toBeGreaterThan(0);
  });

  it('не ходит в базу за тем, чего не спросили', async () => {
    await post('{ profile { name } }').expect(200);

    expect(queries).toHaveLength(1);
    expect(queries[0]).toContain('"profile"');
  });

  // Без DataLoader на каждую строку-родителя уходил бы отдельный запрос.
  it('связанные данные забирает одним запросом на таблицу, а не на строку', async () => {
    const response = await post(DEEP_QUERY).expect(200);
    const profile = (response.body as GraphqlResponse<ProfileShape>).data?.profile;

    expect(profile?.experience.length).toBeGreaterThan(1);
    expect(profile?.projects.length).toBeGreaterThan(1);

    const hits = (table: string) => queries.filter((q) => q.includes(`"${table}"`)).length;

    expect(hits('experience_skill')).toBe(1);
    expect(hits('achievement')).toBe(1);
    expect(hits('project_skill')).toBe(1);
    expect(hits('project_highlight')).toBe(1);
  });

  // 400, а не 200: запрос не прошёл валидацию, до исполнения дело не дошло.
  it('отклоняет слишком глубокий запрос', async () => {
    const response = await post(TOO_DEEP_QUERY).expect(400);
    const error = (response.body as GraphqlResponse<never>).errors?.[0];

    expect(error?.extensions).toMatchObject({
      code: 'GRAPHQL_VALIDATION_FAILED',
      depth: 11,
      maxDepth: 10,
    });
    expect(error?.message).toContain('глубина вложенности');
  });

  it('с корня уводит в песочницу', async () => {
    await request(app.getHttpServer() as Server)
      .get('/')
      .expect(302)
      .expect('Location', '/graphql');
  });
});
