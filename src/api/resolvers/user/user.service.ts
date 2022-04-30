import { Injectable } from '@nestjs/common';
import { User, UserRepository } from '@entities/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
