import { Field, ObjectType } from '@nestjs/graphql';
import { User, UserDTO } from '@database/user';

@ObjectType()
export class PaginatedUserResult {
  @Field(() => [User])
  users: UserDTO[];

  @Field(() => Number)
  total: number;
}
