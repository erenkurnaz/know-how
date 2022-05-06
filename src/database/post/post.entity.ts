import {
  Collection,
  Entity,
  EntityDTO,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
  wrap,
} from '@mikro-orm/core';

import { Base } from '../base/base.entity';
import { User } from '../user';
import { PostRepository } from './post.repository';
import { Tag } from '@database/tag/tag.entity';

@Entity({ customRepository: () => PostRepository })
@Index({
  properties: ['content', 'title'],
})
export class Post extends Base<Post> {
  @Property()
  title: string;

  @Property()
  content: string;

  @ManyToOne()
  owner: User;

  @ManyToMany({
    entity: () => Tag,
    eager: true,
    owner: true,
  })
  tags = new Collection<Tag>(this);

  toJSON(): EntityDTO<Post> {
    const post = this.toObject();
    post.owner = wrap<User>(this.owner).toJSON();
    return post;
  }
}
