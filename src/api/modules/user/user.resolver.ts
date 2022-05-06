import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@api/decorators';
import { UserService } from './user.service';
import { UpdateUserInput, ErrorableUserResult } from './dto';
import { UserDTO } from '@api/modules/user/dto/user.dto';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => ErrorableUserResult)
  async updateUser(
    @CurrentUser('id') userId: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<typeof ErrorableUserResult> {
    const updatedUser = await this.userService.update(userId, input);
    return new UserDTO(updatedUser);
  }

  @Mutation(() => UserDTO)
  async followUser(
    @CurrentUser('id') followerId: string,
    @Args('userId') followingId: string,
  ): Promise<UserDTO> {
    const followedUser = await this.userService.follow(followerId, followingId);
    return new UserDTO(followedUser);
  }

  @Mutation(() => UserDTO)
  async unfollowUser(
    @CurrentUser('id') followerId: string,
    @Args('userId') followingId: string,
  ): Promise<UserDTO> {
    const unfollowedUser = await this.userService.unfollow(
      followerId,
      followingId,
    );
    return new UserDTO(unfollowedUser);
  }

  @Query(() => UserDTO)
  async currentUser(@CurrentUser('id') id: string): Promise<UserDTO> {
    const currentUser = await this.userService.findById(id);
    return new UserDTO(currentUser);
  }
}
