import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { wrap } from '@mikro-orm/core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { IConfig } from '@config/configuration';
import { RefreshTokenRepository } from '@entities/refresh-token';
import { User } from '@entities/user';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly configService: ConfigService<IConfig, true>,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request): Promise<User> {
    const token = request.get('authorization')?.replace('Bearer ', '');

    const refreshToken = await this.refreshTokenRepository.findOne(
      { token },
      { populate: ['user'] },
    );
    if (!refreshToken) throw new UnauthorizedException();

    return wrap(refreshToken.user).toObject();
  }
}
