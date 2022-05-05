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
import { Field, ObjectType } from '@nestjs/graphql';

import { Base } from '../base.entity';
import { User } from '../user';
import { PostRepository } from './post.repository';
import { Tag } from '@database/tag/tag.entity';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
@Index({
  properties: ['content', 'title'],
})
export class Post extends Base<Post> {
  @Field()
  @Property()
  title: string;

  @Field()
  @Property()
  content: string;

  @Field(() => User)
  @ManyToOne()
  owner: User;

  @Field(() => [Tag])
  @ManyToMany({
    entity: () => Tag,
    eager: true,
    owner: true,
  })
  tags = new Collection<Tag>(this);

  toJSON(): PostDTO {
    const post = this.toObject();
    post.owner = wrap<User>(this.owner).toObject();
    return post;
  }
}

export type PostDTO = EntityDTO<Post>;
