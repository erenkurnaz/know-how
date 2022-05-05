import { Injectable } from '@nestjs/common';
import { Tag, TagDTO, TagRepository } from '@database/tag';
import { User, UserRepository } from '@database/user';
import { UserNotFoundException } from '@api/modules/auth/errors';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(userId?: string): Promise<TagDTO[]> {
    const tags = await this.tagRepository.findAll();
    const user = await this.getUser(userId);

    return tags.map((tag) => tag.toJSON(user));
  }

  async create(name: string) {
    const tag = new Tag();
    tag.name = name;

    await this.tagRepository.persistAndFlush(tag);

    return tag.toJSON();
  }

  async addToFavorite(id: string, userId: string) {
    const user = await this.getUser(userId);
    if (!user) throw new UserNotFoundException();

    const tag = await this.tagRepository.findOneOrFail({ id });

    user.favoriteTags.add(tag);
    await this.userRepository.persistAndFlush(user);

    return tag.toJSON(user);
  }

  async removeFromFavorite(id: string, userId: string) {
    const user = await this.getUser(userId);
    if (!user) throw new UserNotFoundException();

    const tag = await this.tagRepository.findOneOrFail({ id });

    user.favoriteTags.remove(tag);
    await this.userRepository.persistAndFlush(user);

    return tag.toJSON(user);
  }

  private async getUser(userId?: string): Promise<User | null> {
    if (!userId) return null;

    return await this.userRepository.findOne(
      { id: userId },
      { populate: ['favoriteTags'] },
    );
  }
}