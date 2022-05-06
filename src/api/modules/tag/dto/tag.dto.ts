import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Tag } from '@database/tag/tag.entity';
import { EntityDTO } from '@mikro-orm/core';

@ObjectType('Tag')
export class TagDTO {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isFavorite: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  constructor(tag: EntityDTO<Tag>) {
    Object.assign(this, tag);
  }
}
