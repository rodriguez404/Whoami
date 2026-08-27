import { buildSchema, parse, validate } from 'graphql';

import { maxDepthRule } from './max-depth.rule';

const schema = buildSchema(`
  type Query { profile: Profile! }
  type Profile { name: String!, experience: [Experience!]! }
  type Experience { company: String!, skills: [Skill!]! }
  type Skill { name: String!, projects: [Project!]! }
  type Project { name: String!, skills: [Skill!]! }
`);

function check(query: string, maxDepth = 4) {
  return validate(schema, parse(query), [maxDepthRule(maxDepth)]);
}

describe('maxDepthRule', () => {
  it('пропускает запрос в пределах лимита', () => {
    expect(check('{ profile { experience { company } } }')).toHaveLength(0);
  });

  it('отклоняет слишком глубокий запрос и сообщает цифры', () => {
    const errors = check('{ profile { experience { skills { projects { name } } } } }');

    expect(errors).toHaveLength(1);
    expect(errors[0].extensions).toMatchObject({ depth: 5, maxDepth: 4 });
    expect(errors[0].message).toContain('глубина вложенности 5');
  });

  it('видит глубину, спрятанную за фрагментом', () => {
    const query = `
      query { profile { ...deep } }
      fragment deep on Profile { experience { skills { projects { name } } } }
    `;
    expect(check(query)).toHaveLength(1);
  });

  it('не считает служебные поля интроспекции', () => {
    const query = '{ __schema { types { fields { type { ofType { name } } } } } }';
    expect(check(query)).toHaveLength(0);
  });

  it('не зацикливается на взаимно ссылающихся фрагментах', () => {
    const query = `
      query { profile { experience { ...a } } }
      fragment a on Experience { skills { ...b } }
      fragment b on Skill { projects { ...c } }
      fragment c on Project { skills { ...b } }
    `;
    expect(() => check(query)).not.toThrow();
  });
});
