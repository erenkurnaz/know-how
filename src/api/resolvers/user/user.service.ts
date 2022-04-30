import { Injectable } from '@nestjs/common';
import { User, UserRepository } from '@entities/user';
import { UserNotFoundException } from '@api/resolvers/auth/errors';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({ id });
    if (!foundUser) throw new UserNotFoundException();

    return foundUser;
  }
}
