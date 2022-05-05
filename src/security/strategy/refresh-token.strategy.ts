import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { IConfig } from '@config/configuration';
import { RefreshTokenRepository } from '@entities/refresh-token';
import { UserDTO } from '@entities/user/user.entity';

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

  async validate(request: Request): Promise<UserDTO> {
    const token = request.get('authorization')?.replace('Bearer ', '');

    const refreshToken = await this.refreshTokenRepository.findOne(
      { token },
      { populate: ['user'] },
    );
    if (!refreshToken) throw new UnauthorizedException();

    return refreshToken.user.toJSON();
  }
}
