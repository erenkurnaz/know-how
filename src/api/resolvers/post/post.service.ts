import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';

import { Post, PostRepository } from '@entities/post';
import { User, UserRepository } from '@entities/user';
import { PostInput } from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll({ populate: ['owner'] });
  }

  async create(user: User, postDto: PostInput): Promise<Post> {
    const post = new Post();
    post.title = postDto.title;
    post.content = postDto.content;
    post.owner = user;

    await this.postRepository.persistAndFlush(post);

    return post;
  }

  async update(id: string, postDto: PostInput, userId: string): Promise<Post> {
    const post = await this.postRepository.findOneOrFail(
      {
        id,
        owner: { id: userId },
      },
      { populate: ['owner'] },
    );
    wrap(post).assign(postDto);
    await this.postRepository.flush();

    return post;
  }

  async findById(id: string): Promise<Post> {
    return this.postRepository.findOneOrFail({ id }, { populate: ['owner'] });
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const owner = await this.userRepository.findOneOrFail({ id: userId });

    return await this.postRepository.find({ owner }, { populate: ['owner'] });
  }
}
