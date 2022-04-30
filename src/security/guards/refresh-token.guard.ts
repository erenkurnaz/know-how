import { GraphqlGuard, TokenStrategies } from './graphql.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard extends GraphqlGuard(
  TokenStrategies.REFRESH_TOKEN,
) {}
