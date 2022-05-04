import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tag } from '@entities/tag';
import { User } from '@entities/user';
import { CurrentUser, Public } from '@api/decorators';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  async createTag(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ): Promise<Tag> {
    return await this.tagService.create(name);
  }

  @Mutation(() => Tag)
  async favoriteTag(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<Tag> {
    return await this.tagService.addToFavorite(id, userId);
  }

  @Mutation(() => Tag)
  async unfavoriteTag(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<Tag> {
    return await this.tagService.removeFromFavorite(id, userId);
  }

  @Public()
  @Query(() => [Tag])
  async tags(@CurrentUser('id') userId: string | undefined): Promise<Tag[]> {
    return await this.tagService.findAll(userId);
  }
}
