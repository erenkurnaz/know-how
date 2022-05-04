import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  wrap,
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

  @OneToMany({
    entity: () => Post,
    mappedBy: (post) => post.owner,
    hidden: true,
  })
  posts = new Collection<Post>(this);

  @Field(() => [User])
  @ManyToMany({
    entity: () => User,
    inversedBy: (user) => user.followings,
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    owner: true,
    hidden: true,
  })
  followers = new Collection<User>(this);

  @Field(() => [User])
  @ManyToMany({
    entity: () => User,
    mappedBy: (user) => user.followers,
    hidden: true,
  })
  followings = new Collection<User>(this);

  @Field(() => Boolean)
  isFollowing = false;

  @OneToMany({
    entity: () => RefreshToken,
    mappedBy: (token) => token.user,
    hidden: true,
  })
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

  toJSON(follower?: User) {
    const user = wrap<User>(this).toObject() as unknown as User;
    user.isFollowing =
      follower && follower.followings.isInitialized()
        ? follower.followings.contains(this)
        : false;

    return user;
  }
}
