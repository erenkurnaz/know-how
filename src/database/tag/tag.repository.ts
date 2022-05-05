import { EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from '@database/tag/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagRepository extends EntityRepository<Tag> {}
