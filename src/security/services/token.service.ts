import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '@entities/user';
import { RefreshToken, RefreshTokenRepository } from '@entities/refresh-token';
import { IConfig } from '@config/configuration';

export interface TokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  private readonly TTL = 1000 * 60 * 60 * 24 * 7;
  private readonly refreshTokenExpires = '7d';
  private readonly accessTokenExpires = '15m';

  constructor(
    private readonly config: ConfigService<IConfig, true>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async generateRefreshToken(user: User): Promise<string> {
    const token = await this.jwtService.signAsync(
      TokenService.mapPayload(user),
      {
        expiresIn: this.refreshTokenExpires,
      },
    );
    await this.saveRefreshToken(user, token);

    return token;
  }

  public async generateAccessToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(TokenService.mapPayload(user), {
      expiresIn: this.accessTokenExpires,
    });
  }

  private static mapPayload({ id, email }: User): TokenPayload {
    return { id, email };
  }

  private async saveRefreshToken(user: User, token: string): Promise<void> {
    const exists = await this.refreshTokenRepository.findOne({ user });

    const refreshToken = exists ?? new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expires = new Date(Date.now() + this.TTL);

    await this.refreshTokenRepository.persistAndFlush(refreshToken);
  }
}
