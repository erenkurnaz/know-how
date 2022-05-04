import { Entity, Property, wrap } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { User } from '@entities/user';
import { TagRepository } from './tag.repository';

@ObjectType()
@Entity({ customRepository: () => TagRepository })
export class Tag extends BaseEntity {
  @Field()
  @Property({ unique: true })
  name: string;

  @Field(() => Boolean, { defaultValue: false })
  isFavorite: boolean;

  toJSON(user?: User | null) {
    const tag = wrap<Tag>(this).toObject();
    tag.isFavorite =
      user && user.favoriteTags.isInitialized()
        ? user.favoriteTags.contains(this)
        : false;

    return tag as Tag;
  }
}
