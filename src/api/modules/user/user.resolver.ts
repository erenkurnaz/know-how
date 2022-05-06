import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@database/user';
import { CurrentUser } from '@api/decorators';
import { UserService } from './user.service';
import {
  UpdateUserInput,
  UserFollowResult,
  UserUnfollowResult,
  UserUpdateResult,
} from './dto';
import { UserDTO } from '@database/user/user.entity';

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

  @Query(() => User)
  async currentUser(@CurrentUser('id') id: string): Promise<UserDTO> {
    return await this.userService.findById(id);
  }
}
