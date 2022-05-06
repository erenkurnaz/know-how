import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@database/user';
import { RefreshToken, RefreshTokenRepository } from '@database/refresh-token';
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
    private readonly userRepository: UserRepository,
  ) {}

  public async generateRefreshToken(payload: TokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(
      TokenService.mapPayload(payload),
      {
        expiresIn: this.refreshTokenExpires,
      },
    );
    await this.saveRefreshToken(payload.id, token);

    return token;
  }

  public async generateAccessToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(TokenService.mapPayload(payload), {
      expiresIn: this.accessTokenExpires,
    });
  }

  private static mapPayload({ id, email }: TokenPayload): TokenPayload {
    return { id, email };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const exists = await this.refreshTokenRepository.findOne({
      user: { id: userId },
    });
    const user = await this.userRepository.findOneOrFail({ id: userId });

    const refreshToken = exists ?? new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expires = new Date(Date.now() + this.TTL);

    await this.refreshTokenRepository.persistAndFlush(refreshToken);
  }
}
