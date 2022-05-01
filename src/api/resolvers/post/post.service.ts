import { Injectable } from '@nestjs/common';
import { Post, PostRepository } from '@entities/post';
import { User } from '@entities/user';
import { CreatePostInput } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll({ populate: ['owner'] });
  }

  async create(user: User, postDto: CreatePostInput): Promise<Post> {
    const post = new Post();
    post.title = postDto.title;
    post.content = postDto.content;
    post.owner = user;

    await this.postRepository.persistAndFlush(post);

    return post;
  }

  async findById(id: string): Promise<Post> {
    return this.postRepository.findOneOrFail({ id }, { populate: ['owner'] });
  }
}
