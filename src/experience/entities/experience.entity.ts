import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Место работы' })
export class Experience {
  @Field(() => ID)
  id!: number;

  @Field()
  company!: string;

  @Field({ description: 'Должность' })
  position!: string;

  @Field(() => GraphQLISODateTime)
  startDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true, description: 'null — по настоящее время' })
  endDate!: Date | null;

  @Field()
  summary!: string;
}
