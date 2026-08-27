import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Достижение на месте работы' })
export class Achievement {
  @Field(() => ID)
  id!: number;

  @Field()
  text!: string;
}
