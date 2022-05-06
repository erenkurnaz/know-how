import { Entity, EntityDTO, Property } from '@mikro-orm/core';

import { Base } from '../base/base.entity';
import { User } from '@database/user';
import { TagRepository } from './tag.repository';

@Entity({ customRepository: () => TagRepository })
export class Tag extends Base<Tag> {
  @Property({ unique: true })
  name: string;

  @Property({ type: Boolean, persist: false })
  isFavorite = false;

  toJSON(user?: User | null): EntityDTO<Tag> {
    const tag = this.toObject();
    tag.isFavorite =
      user && user.favoriteTags.isInitialized()
        ? user.favoriteTags.contains(this)
        : false;

    return tag;
  }
}
