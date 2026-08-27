import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SkillCategory } from '../../generated/prisma/enums';

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Категория навыка',
});

@ObjectType({ description: 'Навык' })
export class Skill {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => SkillCategory)
  category!: SkillCategory;
}
