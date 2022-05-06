import {
  Collection,
  Entity,
  EntityDTO,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { Base } from '../base/base.entity';
import { UserRepository } from './user.repository';
import { Post } from '@database/post';
import { RefreshToken } from '@database/refresh-token';
import { Tag } from '@database/tag';

@Entity({ customRepository: () => UserRepository })
export class User extends Base<User> {
  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  fullName: string;

  @OneToMany({
    entity: () => Post,
    mappedBy: (post) => post.owner,
    hidden: true,
  })
  posts = new Collection<Post>(this);

  @ManyToMany({
    entity: () => User,
    inversedBy: (user) => user.followings,
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    owner: true,
    hidden: true,
  })
  followers = new Collection<User>(this);

  @ManyToMany({
    entity: () => User,
    mappedBy: (user) => user.followers,
    hidden: true,
  })
  followings = new Collection<User>(this);

  @Property({ type: Boolean, persist: false, nullable: true })
  isFollowing = false;

  @OneToMany({
    entity: () => RefreshToken,
    mappedBy: (token) => token.user,
    hidden: true,
  })
  refreshTokens = new Collection<RefreshToken>(this);

  @ManyToMany(() => Tag)
  favoriteTags = new Collection<Tag>(this);

  @Property({ nullable: true })
  github?: string;

  @Property({ nullable: true })
  linkedin?: string;

  @Property({ nullable: true })
  twitter?: string;

  @Property({ nullable: true })
  instagram?: string;

  toJSON(follower?: User): EntityDTO<User> {
    const user = this.toObject();
    user.isFollowing =
      follower && follower.followings.isInitialized()
        ? follower.followings.contains(this)
        : false;

    return user;
  }
}
