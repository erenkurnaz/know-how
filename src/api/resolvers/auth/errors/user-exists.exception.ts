import { HttpStatus } from '@nestjs/common';
import { Exception } from '@src/errors';

export class UserExistsException extends Exception {
  constructor(readonly message = 'User already exists') {
    super(HttpStatus.CONFLICT);
  }
}
