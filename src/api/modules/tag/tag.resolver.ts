import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tag, TagDTO } from '@database/tag';
import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { TagService } from './tag.service';
import { TagCreateResult, TagFavoriteResult, TagUnfavoriteResult } from './dto';
import { PaginationOption } from '@api/modules/shared';
import { PaginatedTagResult } from '@api/modules/tag/dto/paginated-tag.result';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => TagCreateResult)
  async tagCreate(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ): Promise<TagDTO> {
    return await this.tagService.create(name);
  }

  @Mutation(() => TagFavoriteResult)
  async tagFavorite(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<TagDTO> {
    return await this.tagService.addToFavorite(id, userId);
  }

  @Mutation(() => TagUnfavoriteResult)
  async tagUnfavorite(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<TagDTO> {
    return await this.tagService.removeFromFavorite(id, userId);
  }

  @Public()
  @Query(() => PaginatedTagResult)
  async tags(
    @CurrentUser('id') userId: string | undefined,
    @Args('pagination', { nullable: true }) pagination: PaginationOption,
  ): Promise<PaginatedTagResult> {
    return await this.tagService.findAll(userId, pagination);
  }
}
