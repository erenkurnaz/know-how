import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { User } from '../user';
import { PostRepository } from './post.repository';

@ObjectType()
@Entity({ customRepository: () => PostRepository })
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
}
