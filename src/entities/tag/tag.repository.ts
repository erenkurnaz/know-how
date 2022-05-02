import { EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from '@entities/tag/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository extends EntityRepository<Tag> {}
