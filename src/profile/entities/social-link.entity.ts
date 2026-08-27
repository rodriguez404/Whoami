import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SocialKind } from '../../generated/prisma/enums';

registerEnumType(SocialKind, {
  name: 'SocialKind',
  description: 'Тип профессионального ресурса',
});

@ObjectType({ description: 'Ссылка на внешний ресурс' })
export class SocialLink {
  @Field(() => ID)
  id!: number;

  @Field(() => SocialKind)
  kind!: SocialKind;

  @Field()
  url!: string;

  @Field()
  label!: string;
}
