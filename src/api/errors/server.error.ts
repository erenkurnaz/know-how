import { Field, ObjectType } from '@nestjs/graphql';
import { IException } from '@src/errors';

@ObjectType()
export class ServerError implements IException {
  @Field()
  name: string;

  @Field()
  message: string;

  @Field()
  status: number;
}
