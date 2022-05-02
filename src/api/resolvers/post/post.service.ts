import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';

import { Post, PostRepository } from '@entities/post';
import { User, UserRepository } from '@entities/user';
import { PostInput } from './dto';
import { TagRepository } from '@entities/tag';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findAll(): Promise<Post[]> {
    const posts = await this.postRepository.findAll({
      populate: ['owner', 'tags'],
    });

    return posts.map((post) => post.toJSON());
  }

  async create(user: User, postDto: PostInput): Promise<Post> {
    const tags = await this.tagRepository.find({ id: { $in: postDto.tagIds } });

    const post = new Post();
    post.title = postDto.title;
    post.content = postDto.content;
    post.owner = user;
    post.tags.set(tags);

    await this.postRepository.persistAndFlush(post);

    return post.toJSON();
  }

  async update(id: string, postDto: PostInput, userId: string): Promise<Post> {
    const tags = await this.tagRepository.find({ id: { $in: postDto.tagIds } });
    const post = await this.postRepository.findOneOrFail(
      {
        id,
        owner: { id: userId },
      },
      { populate: ['owner'] },
    );
    wrap(post).assign(postDto);
    post.tags.set(tags);

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
    return this.postRepository.findOneOrFail(
      { id },
      { populate: ['owner', 'tags'] },
    );
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const owner = await this.userRepository.findOneOrFail({ id: userId });
    const posts = await this.postRepository.find(
      { owner },
      { populate: ['owner', 'tags'] },
    );

    return posts.map((post) => post.toJSON());
  }
}
