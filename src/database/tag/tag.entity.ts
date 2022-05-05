import { Entity, EntityDTO, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { Base } from '../base/base.entity';
import { User } from '@database/user';
import { TagRepository } from './tag.repository';

@ObjectType()
@Entity({ customRepository: () => TagRepository })
export class Tag extends Base<Tag> {
  @Field()
  @Property({ unique: true })
  name: string;

  @Field(() => Boolean, { defaultValue: false })
  isFavorite: boolean;

  toJSON(user?: User | null): TagDTO {
    const tag = this.toObject();
    tag.isFavorite =
      user && user.favoriteTags.isInitialized()
        ? user.favoriteTags.contains(this)
        : false;

    return tag;
  }
}

export type TagDTO = EntityDTO<Tag>;
