import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@entities/user';
import { RefreshTokenGuard } from '@security/guards';
import { TokenService } from '@security/services';
import { CurrentUser, Public } from '@api/decorators';
import { AuthService } from './auth.service';
import {
  ErrorableAuthResult,
  RegisterInput,
  LoginInput,
  RefreshResult,
  AuthResult,
} from './dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Mutation(() => ErrorableAuthResult)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<typeof ErrorableAuthResult> {
    const result = await this.authService.register(input);

    return await this.mapResultWithTokens(result);
  }

  @Public()
  @Mutation(() => ErrorableAuthResult)
  async login(
    @Args('input') input: LoginInput,
  ): Promise<typeof ErrorableAuthResult> {
    const user = await this.authService.login(input);

    return await this.mapResultWithTokens(user);
  }

  @Public()
  @Mutation(() => RefreshResult)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@CurrentUser() user: User): Promise<RefreshResult> {
    const accessToken = await this.tokenService.generateAccessToken(user);

    return new RefreshResult({
      user: user,
      accessToken,
    });
  }

  private async mapResultWithTokens(
    user: User,
  ): Promise<typeof ErrorableAuthResult> {
    const [refreshToken, accessToken] = await Promise.all([
      this.tokenService.generateRefreshToken(user),
      this.tokenService.generateAccessToken(user),
    ]);

    return new AuthResult({
      user,
      refreshToken,
      accessToken,
    });
  }
}
