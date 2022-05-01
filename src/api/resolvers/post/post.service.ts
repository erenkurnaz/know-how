import { Injectable } from '@nestjs/common';
import { Post, PostRepository } from '@entities/post';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}
