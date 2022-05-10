import { Field, ObjectType } from '@nestjs/graphql';
import { Tag, TagDTO } from '@database/tag';

@ObjectType()
export class PaginatedTagResult {
  @Field(() => [Tag])
  tags: TagDTO[];

  @Field(() => Number)
  total: number;
}
