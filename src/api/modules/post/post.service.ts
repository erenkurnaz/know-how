import { Injectable } from '@nestjs/common';
import { QueryOrder, wrap } from '@mikro-orm/core';

import { Exception } from '@src/errors';
import { Post, PostDTO, PostRepository } from '@database/post';
import { User, UserRepository } from '@database/user';
import { TagRepository } from '@database/tag';
import { PaginationOption } from '@api/modules/shared';
import { PaginatedPostResult, PostInput } from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findAll(
    pagination: PaginationOption,
    keyword?: string,
  ): Promise<PaginatedPostResult> {
    let where = {};
    if (keyword) {
      where = {
        $or: [
          { title: { $ilike: `%${keyword}%` } },
          { content: { $ilike: `%${keyword}%` } },
          { tags: { name: { $ilike: `%${keyword}%` } } },
        ],
      };
    }

    const [posts, total] = await this.postRepository.findAndCount(where, {
      populate: ['owner', 'tags'],
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: { createdAt: QueryOrder.DESC },
    });

    return {
      posts: posts.map((post) => post.toJSON()),
      total,
    };
  }

  async create(user: User, postDto: PostInput): Promise<PostDTO> {
    const tags = await this.tagRepository.find({ id: { $in: postDto.tagIds } });

    const post = new Post();
    post.title = postDto.title;
    post.content = postDto.content;
    post.owner = user;
    post.tags.set(tags);

    await this.postRepository.persistAndFlush(post);

    return post.toJSON();
  }

  async update(
    id: string,
    postDto: PostInput,
    userId: string,
  ): Promise<PostDTO> {
    const tags = await this.tagRepository.find({ id: { $in: postDto.tagIds } });
    const post = await this.postRepository.findOne(
      {
        id,
        owner: { id: userId },
      },
      { populate: ['owner'] },
    );
    if (!post) throw new Exception(404, 'Post not found!');

    wrap(post).assign(postDto);
    post.tags.set(tags);

    await this.postRepository.flush();

    return post.toJSON();
  }

  async delete(id: string, userId: string): Promise<PostDTO> {
    const post = await this.postRepository.findOne({
      id,
      owner: { id: userId },
    });
    if (!post) throw new Exception(404, 'Post not found!');

    await this.postRepository.removeAndFlush(post);
    return post.toJSON();
  }

  async findById(id: string): Promise<PostDTO> {
    const post = await this.postRepository.findOne(
      { id },
      { populate: ['owner', 'tags'] },
    );
    if (!post) throw new Exception(404, 'Post not found!');

    return post.toJSON();
  }

  async findByUserId(userId: string): Promise<PostDTO[]> {
    const posts = await this.postRepository.find(
      { owner: { id: userId } },
      { populate: ['owner', 'tags'] },
    );

    return posts.map((post) => post.toJSON());
  }

  async getFeed(
    userId: string,
    pagination?: PaginationOption,
  ): Promise<PaginatedPostResult> {
    const user = await this.userRepository.findOneOrFail(
      { id: userId },
      { populate: ['followings', 'favoriteTags'] },
    );

    const [posts, total] = await this.postRepository.findAndCount(
      {
        $or: [
          { owner: { $in: user.followings.getItems() } },
          { tags: { $in: user.favoriteTags.getItems() } },
        ],
      },
      {
        populate: ['owner', 'tags'],
        limit: pagination?.limit,
        offset: pagination?.offset,
        orderBy: {
          createdAt: QueryOrder.DESC,
        },
      },
    );

    return {
      posts: posts.map((post) => post.toJSON()),
      total,
    };
  }
}
