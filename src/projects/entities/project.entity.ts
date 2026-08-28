import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { ProjectKind } from '../../generated/prisma/enums';

registerEnumType(ProjectKind, {
  name: 'ProjectKind',
  description: 'Категория проекта',
});

@ObjectType({ description: 'Проект' })
export class Project {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field({ description: 'Краткое описание' })
  description!: string;

  // Явный () => String: из union-типа string | null метаданные типа не выводятся.
  @Field(() => String, { nullable: true, description: 'Ссылка на работающий проект' })
  url!: string | null;

  @Field(() => String, { nullable: true, description: 'Ссылка на репозиторий' })
  repoUrl!: string | null;

  @Field(() => ProjectKind)
  kind!: ProjectKind;

  @Field()
  isFeatured!: boolean;
}
