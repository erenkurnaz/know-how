import { HttpStatus } from '@nestjs/common';
import { Exception, IException } from './exception';

export interface IValidationException extends IException {
  fields: { field: string; message: string }[];
}

export class ValidationException
  extends Exception
  implements IValidationException
{
  constructor(readonly fields: { field: string; message: string }[]) {
    super(HttpStatus.UNPROCESSABLE_ENTITY);
    this.message = 'Validation failed';
  }
}
