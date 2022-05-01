import { Injectable } from '@nestjs/common';
import { Post, PostRepository } from '@entities/post';
import { User, UserRepository } from '@entities/user';
import { CreatePostInput } from './dto';
import { UserNotFoundException } from '@api/resolvers/auth/errors';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

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

  async findByUserId(userId: string): Promise<Post[]> {
    const owner = await this.userRepository.findOne({ id: userId });
    if (!owner) throw new UserNotFoundException();

    return await this.postRepository.find({ owner }, { populate: ['owner'] });
  }
}
