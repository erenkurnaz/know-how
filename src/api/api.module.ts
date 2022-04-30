import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { UserModule } from '@entities/user';
import { SecurityModule } from '@security/security.module';
import { AccessTokenGuard } from '@security/guards';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { UserResolver, UserService } from './resolvers/user';
import { AuthResolver, AuthService } from './resolvers/auth';
import { ClassValidationPipe } from './pipes/validation.pipe';

@Module({
  imports: [SecurityModule, UserModule],
  providers: [
    UserResolver,
    UserService,
    AuthResolver,
    AuthService,
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
