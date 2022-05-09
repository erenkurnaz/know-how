import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Post, PostDTO } from '@database/post';
import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { PostService } from './post.service';
import {
  PostInput,
  PostCreateResult,
  PostUpdateResult,
  PostDeleteResult,
} from './dto';
import { PaginationOption } from '@api/modules/shared/pagination-option';
import { PostsResult } from '@api/modules/post/dto/posts.result';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => PostCreateResult)
  async postCreate(
    @CurrentUser() user: User,
    @Args('input') postDto: PostInput,
  ): Promise<PostDTO> {
    return await this.postService.create(user, postDto);
  }

  @Mutation(() => PostUpdateResult)
  async postUpdate(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
    @Args('input') postDto: PostInput,
  ): Promise<PostDTO> {
    return await this.postService.update(id, postDto, userId);
  }

  @Mutation(() => PostDeleteResult)
  async postDelete(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<PostDTO> {
    return await this.postService.delete(id, userId);
  }

  @Query(() => [Post])
  async feed(@CurrentUser('id') userId: string): Promise<PostDTO[]> {
    return await this.postService.getFeed(userId);
  }

  @Public()
  @Query(() => Post)
  async post(@Args('id') id: string): Promise<PostDTO> {
    return await this.postService.findById(id);
  }

  @Public()
  @Query(() => PostsResult)
  async posts(
    @Args('pagination', { nullable: true })
    pagination: PaginationOption,
    @Args('keyword', { nullable: true })
    keyword?: string,
  ): Promise<PostsResult> {
    return await this.postService.findAll(pagination, keyword);
  }

  @Public()
  @Query(() => [Post])
  async postsByUserId(@Args('userId') userId: string): Promise<PostDTO[]> {
    return await this.postService.findByUserId(userId);
  }
}
