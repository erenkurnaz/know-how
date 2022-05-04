import { Entity, Property, wrap } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { User } from '@entities/user';
import { TagRepository } from './tag.repository';

@ObjectType()
@Entity({ customRepository: () => TagRepository })
export class Tag extends BaseEntity {
  @Field()
  @Property()
  name: string;

  @Field(() => Boolean, { defaultValue: false })
  isFavorite: boolean;

  toJSON(user?: User | null) {
    const tag = wrap<Tag>(this).toObject();

    if (user && user.favoriteTags.isInitialized()) {
      tag.isFavorite = user.favoriteTags.contains(this);
    } else {
      tag.isFavorite = false;
    }
    return tag as Tag;
  }
}
