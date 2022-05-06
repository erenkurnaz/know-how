import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';

import { Post, PostDTO, PostRepository } from '@database/post';
import { User, UserRepository } from '@database/user';
import { PostInput } from './dto';
import { TagRepository } from '@database/tag';
import { Exception } from '@src/errors';

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

  async search(keyword: string): Promise<PostDTO[]> {
    const foundPosts = await this.postRepository.find(
      {
        $or: [
          { title: { $ilike: keyword } },
          { content: { $ilike: keyword } },
          { tags: { name: { $ilike: keyword } } },
        ],
      },
      { populate: ['owner', 'tags'] },
    );
    return foundPosts.map((post) => post.toJSON());
  }

  async getFeed(userId: string) {
    const user = await this.userRepository.findOneOrFail(
      { id: userId },
      { populate: ['followings', 'favoriteTags'] },
    );

    const posts = await this.postRepository.find(
      {
        $or: [
          { owner: { $in: user.followings.getItems() } },
          { tags: { $in: user.favoriteTags.getItems() } },
        ],
      },
      { populate: ['owner', 'tags'] },
    );

    return posts.map((post) => post.toJSON());
  }
}
