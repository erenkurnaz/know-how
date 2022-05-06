import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { UserModule } from '@database/user';
import { PostModule } from '@database/post';
import { TagModule } from '@database/tag';
import { SecurityModule } from '@security/security.module';
import { AccessTokenGuard } from '@security/guards';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ClassValidationPipe } from './pipes/validation.pipe';
import { UserResolver, UserService } from './modules/user';
import { AuthResolver, AuthService } from './modules/auth';
import { PostResolver, PostService } from './modules/post';
import { TagResolver, TagService } from './modules/tag';

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
