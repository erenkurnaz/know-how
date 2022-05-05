import { HttpStatus } from '@nestjs/common';
import { Exception } from '@src/errors';

export class UserNotFoundException extends Exception {
  constructor(readonly message = 'User not found please check your email') {
    super(HttpStatus.NOT_FOUND);
  }
}
