import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@entities/user';
import { CurrentUser } from '@api/decorators';
import { UserService } from './user.service';
import { UpdateUserInput, ErrorableUserResult } from './dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => ErrorableUserResult)
  async updateUser(
    @CurrentUser('id') userId: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<typeof ErrorableUserResult> {
    return await this.userService.update(userId, input);
  }

  @Mutation(() => User)
  async followUser(
    @CurrentUser('id') followerId: string,
    @Args('userId') followingId: string,
  ) {
    return await this.userService.follow(followerId, followingId);
  }

  @Query(() => User)
  async currentUser(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }
}
