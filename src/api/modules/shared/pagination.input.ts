import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 6 })
  limit: number;

  @Field(() => Number, { defaultValue: 0 })
  offset: number;
}
