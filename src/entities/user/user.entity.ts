import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { UserRepository } from './user.repository';
import { Post } from '@entities/post';
import { RefreshToken } from '@entities/refresh-token';
import { Tag } from '@entities/tag';

@ObjectType()
@Entity({ customRepository: () => UserRepository })
export class User extends BaseEntity {
  @Field()
  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Field()
  @Property()
  fullName: string;

  @OneToMany(() => Post, (post) => post.owner, { hidden: true })
  posts = new Collection<Post>(this);

  @OneToMany(() => RefreshToken, (token) => token.user, { hidden: true })
  refreshTokens = new Collection<RefreshToken>(this);

  @Field(() => [Tag])
  @ManyToMany(() => Tag)
  favoriteTags = new Collection<Tag>(this);

  @Field({ nullable: true })
  @Property({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  instagram?: string;
}
