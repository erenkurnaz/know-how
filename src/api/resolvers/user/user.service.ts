import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRepository } from '@entities/user';
import { UserNotFoundException } from '@api/resolvers/auth/errors';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({ id });
    if (!foundUser) throw new UserNotFoundException();

    return foundUser;
  }

  async update(id: string, userDto: Partial<User>): Promise<User> {
    const foundUser = await this.userRepository.findOne({ id });
    if (!foundUser) throw new UserNotFoundException();

    wrap(foundUser).assign(userDto);
    await this.userRepository.flush();

    return foundUser;
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
