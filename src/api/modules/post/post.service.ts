import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';

import { Post, PostDTO, PostRepository } from '@database/post';
import { User, UserRepository } from '@database/user';
import { PostInput } from './dto';
import { TagRepository } from '@database/tag';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findAll(): Promise<PostDTO[]> {
    const posts = await this.postRepository.findAll({
      populate: ['owner', 'tags'],
    });

    return posts.map((post) => post.toJSON());
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

  async delete(id: string, userId: string): Promise<PostDTO> {
    const post = await this.postRepository.findOneOrFail({
      id,
      owner: { id: userId },
    });

    await this.postRepository.removeAndFlush(post);
    return post.toJSON();
  }

  async findById(id: string): Promise<PostDTO> {
    const foundPost = await this.postRepository.findOneOrFail(
      { id },
      { populate: ['owner', 'tags'] },
    );
    return foundPost.toJSON();
  }

  async findByUserId(userId: string): Promise<PostDTO[]> {
    const owner = await this.userRepository.findOneOrFail({ id: userId });
    const posts = await this.postRepository.find(
      { owner },
      { populate: ['owner', 'tags'] },
    );

    return posts.map((post) => post.toJSON());
  }

  async search(keyword: string): Promise<Post[]> {
    return await this.postRepository.find(
      {
        $or: [{ title: { $ilike: keyword } }, { content: { $ilike: keyword } }],
      },
      { populate: ['owner', 'tags'] },
    );
  }
}
