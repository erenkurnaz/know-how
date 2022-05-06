import { ObjectType, OmitType } from '@nestjs/graphql';

import { AuthResult } from './auth.result';

@ObjectType()
export class RefreshResult extends OmitType(AuthResult, ['refreshToken']) {
  constructor({ accessToken, user }: RefreshResult) {
    super();
    this.accessToken = accessToken;
    this.user = user;
  }
}
