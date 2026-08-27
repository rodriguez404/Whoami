import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Ключевой пункт по проекту' })
export class ProjectHighlight {
  @Field(() => ID)
  id!: number;

  @Field()
  text!: string;
}
