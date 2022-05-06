import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { PostService } from './post.service';
import {
  PostDTO,
  PostInput,
  PostUpdateResult,
  PostCreateResult,
  PostDeleteResult,
} from './dto';

@Resolver(() => PostDTO)
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

  @Public()
  @Query(() => [PostDTO])
  async postSearch(@Args('keyword') keyword: string) {
    return await this.postService.search(keyword);
  }

  @Public()
  @Query(() => PostDTO)
  async post(@Args('id') id: string): Promise<PostDTO> {
    return await this.postService.findById(id);
  }

  @Public()
  @Query(() => [PostDTO])
  async posts(): Promise<PostDTO[]> {
    return await this.postService.findAll();
  }

  @Public()
  @Query(() => [PostDTO])
  async postsByUserId(@Args('userId') userId: string): Promise<PostDTO[]> {
    return await this.postService.findByUserId(userId);
  }
}
