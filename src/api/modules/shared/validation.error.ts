import { Field, ObjectType } from '@nestjs/graphql';
import { IValidationException } from '@src/errors';

@ObjectType()
export class ValidationErrorField {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class ValidationError implements IValidationException {
  @Field()
  name: string;

  @Field()
  message: string;

  @Field(() => [ValidationErrorField])
  fields: ValidationErrorField[];

  @Field()
  status: number;
}
