import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { UserModule } from '@entities/user';
import { PostModule } from '@entities/post';
import { TagModule } from '@entities/tag';
import { SecurityModule } from '@security/security.module';
import { AccessTokenGuard } from '@security/guards';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ClassValidationPipe } from './pipes/validation.pipe';
import { UserResolver, UserService } from './resolvers/user';
import { AuthResolver, AuthService } from './resolvers/auth';
import { PostResolver, PostService } from './resolvers/post';
import { TagResolver, TagService } from './resolvers/tag';
@Module({
  imports: [SecurityModule, UserModule, PostModule, TagModule],
  providers: [
    UserResolver,
    UserService,
    AuthResolver,
    AuthService,
    PostResolver,
    PostService,
    TagResolver,
    TagService,
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
