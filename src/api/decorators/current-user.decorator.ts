import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '@entities/user';

export const CurrentUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const user: User = ctx.getContext().req.user;
    if (!user) return undefined;

    return data ? user[data] : user;
  },
);
