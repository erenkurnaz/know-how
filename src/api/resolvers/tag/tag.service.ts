import { Injectable } from '@nestjs/common';
import { Tag, TagRepository } from '@entities/tag';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }
}
