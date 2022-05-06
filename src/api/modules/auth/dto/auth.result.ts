import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@database/user';
import { createErrorableUnion } from '@api/utils/union-factory';

@ObjectType()
export class AuthResult {
  @Field()
  user: User;

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
