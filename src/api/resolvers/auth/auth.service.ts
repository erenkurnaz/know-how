import { Injectable } from '@nestjs/common';

import {
  InvalidCredentialsException,
  UserExistsException,
  UserNotFoundException,
} from './errors';
import { UserRepository, User } from '@entities/user';
import { HashService } from '@security/services';
import { LoginInput, RegisterInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async register({ email, password, fullName }: RegisterInput): Promise<User> {
    const exists = await this.userRepository.checkExists({ email });
    if (exists) throw new UserExistsException();

    const user = new User();
    user.email = email;
    user.fullName = fullName;
    user.password = await this.hashService.hash(password);

    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async login({ email, password }: LoginInput): Promise<User> {
    const user = await this.userRepository.findOne({
      email,
    });
    if (!user) throw new UserNotFoundException();

    const result = await this.hashService.verify(password, user.password);
    if (!result) throw new InvalidCredentialsException();

    return user;
  }
}
