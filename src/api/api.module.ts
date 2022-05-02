import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { UserModule } from '@entities/user';
import { PostModule } from '@entities/post';
import { SecurityModule } from '@security/security.module';
import { AccessTokenGuard } from '@security/guards';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ClassValidationPipe } from './pipes/validation.pipe';
import { UserResolver, UserService } from './resolvers/user';
import { AuthResolver, AuthService } from './resolvers/auth';
import { PostResolver, PostService } from './resolvers/post';

@Module({
  imports: [SecurityModule, UserModule, PostModule],
  providers: [
    UserResolver,
    UserService,
    AuthResolver,
    AuthService,
    PostResolver,
    PostService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ClassValidationPipe,
    },
  ],
})
export class ApiModule {}
