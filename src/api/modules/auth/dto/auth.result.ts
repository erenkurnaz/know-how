import { Field, ObjectType } from '@nestjs/graphql';

import { createErrorableUnion } from '@api/utils/union-factory';
import { UserDTO } from '@api/modules/user/dto/user.dto';

@ObjectType()
export class AuthResult {
  @Field()
  user: UserDTO;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  constructor({ user, refreshToken, accessToken }: AuthResult) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export const SignInResult = createErrorableUnion('SignInResult', AuthResult);

export const SignUpResult = createErrorableUnion('SignUpResult', AuthResult);
