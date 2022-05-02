import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Tag } from '@entities/tag';
import { Public } from '@api/decorators';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  async createTag(@Args('name') name: string): Promise<Tag> {
    return await this.tagService.create(name);
  }

  @Public()
  @Query(() => [Tag])
  async tags(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }
}
