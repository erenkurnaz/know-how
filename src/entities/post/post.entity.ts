import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
  wrap,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { User } from '../user';
import { PostRepository } from './post.repository';
import { Tag } from '@entities/tag/tag.entity';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
@Index({
  properties: ['content', 'title'],
})
export class Post extends BaseEntity {
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

  toJSON() {
    this.owner = wrap<User>(this.owner).toObject() as unknown as User;
    return this;
  }
}
