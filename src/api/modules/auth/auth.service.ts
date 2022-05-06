import { Injectable } from '@nestjs/common';

import {
  InvalidCredentialsException,
  UserExistsException,
  UserNotFoundException,
} from './errors';
import { UserRepository, User } from '@database/user';
import { HashService } from '@security/services';
import { SignInInput, SignUpInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async register({ email, password, fullName }: SignUpInput): Promise<User> {
    const exists = await this.userRepository.checkExists({ email });
    if (exists) throw new UserExistsException();

    const user = new User();
    user.email = email;
    user.fullName = fullName;
    user.password = await this.hashService.hash(password);

    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async login({ email, password }: SignInInput): Promise<User> {
    const user = await this.userRepository.findOne({
      email,
    });
    if (!user) throw new UserNotFoundException();

    const result = await this.hashService.verify(password, user.password);
    if (!result) throw new InvalidCredentialsException();

    return user;
  }
}
