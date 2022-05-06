import { BadRequestException, Injectable } from '@nestjs/common';

import { User, UserRepository } from '@database/user';
import { UserNotFoundException } from '@api/modules/auth/errors';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string) {
    const foundUser = await this.userRepository.findOne({ id });
    if (!foundUser) throw new UserNotFoundException();

    return foundUser.toJSON();
  }

  async update(id: string, userDto: Partial<User>) {
    const foundUser = await this.userRepository.findOne({ id });
    if (!foundUser) throw new UserNotFoundException();

    foundUser.assign(userDto);
    await this.userRepository.flush();

    return foundUser.toJSON();
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestException();

    const [follower, following] = await Promise.all([
      this.userRepository.findOneOrFail(
        { id: followerId },
        { populate: ['followings'] },
      ),
      this.userRepository.findOneOrFail({
        id: followingId,
      }),
    ]);

    follower.followings.add(following);
    await this.userRepository.persistAndFlush(follower);

    return following.toJSON(follower);
  }

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestException();
    const [follower, following] = await Promise.all([
      this.userRepository.findOneOrFail(
        { id: followerId },
        { populate: ['followings'] },
      ),
      this.userRepository.findOneOrFail({ id: followingId }),
    ]);

    follower.followings.remove(following);
    await this.userRepository.persistAndFlush(follower);

    return following.toJSON(follower);
  }
}
