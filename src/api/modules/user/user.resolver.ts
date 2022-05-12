import { NotImplementedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { UserService } from './user.service';
import {
  PaginatedUserResult,
  UpdateUserInput,
  UserFollowResult,
  UserUnfollowResult,
  UserUpdateResult,
} from './dto';
import { UserDTO } from '@database/user/user.entity';
import { PaginationInput } from '@api/modules/shared';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserUpdateResult)
  async updateUser(
    @CurrentUser('id') userId: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserDTO> {
    return await this.userService.update(userId, input);
  }

  @Mutation(() => UserFollowResult)
  async followUser(
    @CurrentUser('id') followerId: string,
    @Args('userId') followingId: string,
  ): Promise<UserDTO> {
    return await this.userService.follow(followerId, followingId);
  }

  @Mutation(() => UserUnfollowResult)
  async unfollowUser(
    @CurrentUser('id') followerId: string,
    @Args('userId') followingId: string,
  ): Promise<UserDTO> {
    return await this.userService.unfollow(followerId, followingId);
  }

  @Public()
  @Query(() => PaginatedUserResult)
  async users(
    @CurrentUser('id') userId?: string,
    @Args('keyword', { nullable: true }) keyword?: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.userService.findAll(keyword, pagination, userId);
  }

  @Query(() => User)
  async currentUser(@CurrentUser('id') id: string): Promise<UserDTO> {
    return await this.userService.findById(id);
  }
}
