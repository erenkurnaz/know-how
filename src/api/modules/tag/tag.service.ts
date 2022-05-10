import { Injectable } from '@nestjs/common';
import { QueryOrder } from '@mikro-orm/core';

import { Tag, TagDTO, TagRepository } from '@database/tag';
import { User, UserRepository } from '@database/user';
import { Exception } from '@src/errors';
import { UserNotFoundException } from '@api/modules/auth/errors';
import { PaginationOption } from '@api/modules/shared';
import { PaginatedTagResult } from './dto/paginated-tag.result';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(
    userId?: string,
    pagination?: PaginationOption,
  ): Promise<PaginatedTagResult> {
    const [tags, total] = await this.tagRepository.findAndCount(
      {},
      {
        limit: pagination?.limit,
        offset: pagination?.offset,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
    const user = await this.getUser(userId);

    return {
      tags: tags.map((tag) => tag.toJSON(user)),
      total,
    };
  }

  async create(name: string): Promise<TagDTO> {
    const tag = new Tag();
    tag.name = name;

    await this.tagRepository.persistAndFlush(tag);

    return tag.toJSON();
  }

  async addToFavorite(id: string, userId: string): Promise<TagDTO> {
    const user = await this.getUser(userId);
    if (!user) throw new UserNotFoundException();

    const tag = await this.tagRepository.findOneOrFail({ id });
    if (user.favoriteTags.contains(tag))
      throw new Exception(500, 'Tag already added to favorites');

    user.favoriteTags.add(tag);
    await this.userRepository.persistAndFlush(user);

    return tag.toJSON(user);
  }

  async removeFromFavorite(id: string, userId: string): Promise<TagDTO> {
    const user = await this.getUser(userId);
    if (!user) throw new UserNotFoundException();

    const tag = await this.tagRepository.findOneOrFail({ id });
    if (!user.favoriteTags.contains(tag))
      throw new Exception(500, 'Tag not in favorites');

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
