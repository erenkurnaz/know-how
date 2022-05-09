import { Field, ObjectType } from '@nestjs/graphql';
import { Post, PostDTO } from '@database/post';

@ObjectType()
export class PaginatedPostResult {
  @Field(() => [Post])
  posts: PostDTO[];

  @Field(() => Number)
  total: number;
}
