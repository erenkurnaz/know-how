import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EntityDTO } from '@mikro-orm/core';

import { Post } from '@database/post/post.entity';
import { TagDTO } from '@api/modules/tag/dto/tag.dto';
import { UserDTO } from '@api/modules/user/dto/user.dto';

@ObjectType('Post')
export class PostDTO {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => UserDTO)
  owner: UserDTO;

  @Field(() => [TagDTO])
  tags: TagDTO[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  constructor(post: EntityDTO<Post>) {
    Object.assign(this, post);
  }
}
