import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IConfig } from '@config/configuration';
import { RefreshTokenModule } from '@database/refresh-token';
import { UserModule } from '@database/user';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { HashService, TokenService } from './services';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) => ({
        secret: config.get('jwtSecret'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
    }),
    RefreshTokenModule,
  ],
  providers: [
    HashService,
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [HashService, TokenService],
})
export class SecurityModule {}
