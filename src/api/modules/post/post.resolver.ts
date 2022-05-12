import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Post, PostDTO } from '@database/post';
import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { PaginationInput } from '@api/modules/shared';
import { PostService } from './post.service';
import {
  PostInput,
  PaginatedPostResult,
  PostCreateResult,
  PostUpdateResult,
  PostDeleteResult,
} from './dto';

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

  @Query(() => PaginatedPostResult)
  async feed(
    @CurrentUser('id') userId: string,
    @Args('pagination', { nullable: true })
    pagination: PaginationInput,
  ): Promise<PaginatedPostResult> {
    return await this.postService.getFeed(userId, pagination);
  }

  @Public()
  @Query(() => Post)
  async post(@Args('id') id: string): Promise<PostDTO> {
    return await this.postService.findById(id);
  }

  @Public()
  @Query(() => PaginatedPostResult)
  async posts(
    @Args('pagination', { nullable: true })
    pagination: PaginationInput,
    @Args('keyword', { nullable: true })
    keyword?: string,
  ): Promise<PaginatedPostResult> {
    return await this.postService.findAll(pagination, keyword);
  }

  @Public()
  @Query(() => [Post])
  async postsByUserId(@Args('userId') userId: string): Promise<PostDTO[]> {
    return await this.postService.findByUserId(userId);
  }
}
