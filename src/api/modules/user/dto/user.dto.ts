import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityDTO } from '@mikro-orm/core';

import { User } from '@database/user/user.entity';
import { TagDTO } from '@api/modules/tag/dto/tag.dto';
import { PostDTO } from '@api/modules/post/dto/post.dto';

@ObjectType('User')
export class UserDTO {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field(() => [TagDTO], { nullable: true })
  favoriteTags: TagDTO[];

  @Field(() => [PostDTO], { nullable: true })
  posts: PostDTO[];

  @Field(() => [UserDTO], { nullable: true })
  followers: UserDTO[];

  @Field(() => [UserDTO], { nullable: true })
  followings: UserDTO[];

  @Field(() => Boolean, { nullable: true })
  isFollowing: boolean | null;

  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  instagram?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  constructor(entity: User | EntityDTO<User>) {
    Object.assign(this, entity);
  }
}
