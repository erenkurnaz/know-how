import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Post } from '@entities/post';
import { CurrentUser, Public } from '@api/decorators';
import { User } from '@entities/user';
import { PostService } from './post.service';
import { CreatePostInput } from './dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: User,
    @Args('input') postDto: CreatePostInput,
  ): Promise<Post> {
    return await this.postService.create(user, postDto);
  }

  @Public()
  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    return await this.postService.findById(id);
  }

  @Public()
  @Query(() => [Post])
  async postsByUserId(@Args('userId') userId: string): Promise<Post[]> {
    return await this.postService.findByUserId(userId);
  }

  @Public()
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await this.postService.findAll();
  }
}
