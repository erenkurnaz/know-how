import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@database/user';
import { CurrentUser, Public } from '@api/decorators';
import { TagService } from './tag.service';
import { TagDTO } from '@api/modules/tag/dto/tag.dto';

@Resolver(() => TagDTO)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => TagDTO)
  async createTag(
    @CurrentUser() user: User,
    @Args('name') name: string,
  ): Promise<TagDTO> {
    return await this.tagService.create(name);
  }

  @Mutation(() => TagDTO)
  async favoriteTag(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<TagDTO> {
    return await this.tagService.addToFavorite(id, userId);
  }

  @Mutation(() => TagDTO)
  async unfavoriteTag(
    @CurrentUser('id') userId: string,
    @Args('id') id: string,
  ): Promise<TagDTO> {
    return await this.tagService.removeFromFavorite(id, userId);
  }

  @Public()
  @Query(() => [TagDTO])
  async tags(@CurrentUser('id') userId: string | undefined): Promise<TagDTO[]> {
    return await this.tagService.findAll(userId);
  }
}
