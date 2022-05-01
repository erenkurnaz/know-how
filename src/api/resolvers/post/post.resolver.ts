import { Query, Resolver } from '@nestjs/graphql';

import { Post } from '@entities/post';
import { Public } from '@api/decorators';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await this.postService.findAll();
  }
}
