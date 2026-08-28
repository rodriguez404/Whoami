import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Профиль специалиста' })
export class Profile {
  @Field(() => ID)
  id!: number;

  // Резолвим full_name из БД в name для API
  @Field({ description: 'Имя' })
  name!: string;

  @Field({ description: 'Должность' })
  headline!: string;

  @Field({ description: 'Краткое описание' })
  description!: string;

  @Field()
  location!: string;

  @Field({ description: 'Готовность к работе' })
  availability!: string;
}
