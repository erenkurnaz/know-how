import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tag, TagDTO } from '@database/tag';
import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { TagService } from './tag.service';
import { TagCreateResult, TagFavoriteResult, TagUnfavoriteResult } from './dto';

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
  @Query(() => [Tag])
  async tags(@CurrentUser('id') userId: string | undefined): Promise<TagDTO[]> {
    return await this.tagService.findAll(userId);
  }
}
