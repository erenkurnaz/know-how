import { HttpStatus } from '@nestjs/common';
import { Exception } from '@src/errors';

export class InvalidCredentialsException extends Exception {
  constructor(
    readonly message = 'Invalid credentials please check your credentials',
  ) {
    super(HttpStatus.FORBIDDEN);
  }
}
