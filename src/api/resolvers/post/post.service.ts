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
    const posts = await this.postRepository.findAll({ populate: ['owner'] });

    return posts.map((post) => post.toJSON());
  }

  async create(user: User, postDto: PostInput): Promise<Post> {
    const post = new Post();
    post.title = postDto.title;
    post.content = postDto.content;
    post.owner = user;

    await this.postRepository.persistAndFlush(post);

    return post.toJSON();
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

    return post.toJSON();
  }

  async delete(id: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({
      id,
      owner: { id: userId },
    });

    await this.postRepository.removeAndFlush(post);
    return post.toJSON();
  }

  async findById(id: string): Promise<Post> {
    return this.postRepository.findOneOrFail({ id }, { populate: ['owner'] });
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const owner = await this.userRepository.findOneOrFail({ id: userId });
    const posts = await this.postRepository.find(
      { owner },
      { populate: ['owner'] },
    );

    return posts.map((post) => post.toJSON());
  }
}
