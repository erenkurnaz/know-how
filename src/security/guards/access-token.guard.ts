import { TokenStrategies, GraphqlGuard } from './graphql.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AccessTokenGuard extends GraphqlGuard(
  TokenStrategies.ACCESS_TOKEN,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getArgByIndex(2).req;
    const token = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic && !token) return true;

    return super.canActivate(context);
  }
}
