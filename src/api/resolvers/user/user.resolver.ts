import { Query, Resolver } from '@nestjs/graphql';

import { User } from '@entities/user';
import { CurrentUser } from '@api/decorators';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async currentUser(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }
}
