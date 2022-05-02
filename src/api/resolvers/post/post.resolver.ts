import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Post } from '@entities/post';
import { User } from '@entities/user';
import { CurrentUser, Public } from '@api/decorators';
import { PostService } from './post.service';
import { PostInput } from './dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: User,
    @Args('input') postDto: PostInput,
  ): Promise<Post> {
    return await this.postService.create(user, postDto);
  }

  @Mutation(() => Post)
  async updatePost(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
    @Args('input') postDto: PostInput,
  ): Promise<Post> {
    return await this.postService.update(id, postDto, userId);
  }

  @Mutation(() => Post)
  async deletePost(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<Post> {
    return await this.postService.delete(id, userId);
  }

  @Public()
  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    return await this.postService.findById(id);
  }

  @Public()
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Public()
  @Query(() => [Post])
  async postsByUserId(@Args('userId') userId: string): Promise<Post[]> {
    return await this.postService.findByUserId(userId);
  }
}
