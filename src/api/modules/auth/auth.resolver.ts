import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@database/user';
import { RefreshTokenGuard } from '@security/guards';
import { TokenService } from '@security/services';
import { CurrentUser, Public } from '@api/decorators';
import { AuthService } from './auth.service';
import {
  SignUpInput,
  SignInInput,
  RefreshResult,
  AuthResult,
  SignUpResult,
  SignInResult,
} from './dto';
import { UserDTO } from '@api/modules/user/dto/user.dto';
import { EntityDTO } from '@mikro-orm/core';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Mutation(() => SignUpResult)
  async signUp(
    @Args('input') input: SignUpInput,
  ): Promise<typeof SignUpResult> {
    const result = await this.authService.register(input);

    return await this.mapResultWithTokens(result);
  }

  @Public()
  @Mutation(() => SignInResult)
  async signIn(
    @Args('input') input: SignInInput,
  ): Promise<typeof SignInResult> {
    const user = await this.authService.login(input);

    return await this.mapResultWithTokens(user);
  }

  @Public()
  @Query(() => RefreshResult)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @CurrentUser() user: EntityDTO<User>,
  ): Promise<RefreshResult> {
    const accessToken = await this.tokenService.generateAccessToken(user);

    return new RefreshResult({
      user: new UserDTO(user),
      accessToken,
    });
  }

  private async mapResultWithTokens(user: User): Promise<AuthResult> {
    const [refreshToken, accessToken] = await Promise.all([
      this.tokenService.generateRefreshToken({
        id: user.id,
        email: user.email,
      }),
      this.tokenService.generateAccessToken({ id: user.id, email: user.email }),
    ]);

    return new AuthResult({
      user: user.toJSON(),
      refreshToken,
      accessToken,
    });
  }
}
