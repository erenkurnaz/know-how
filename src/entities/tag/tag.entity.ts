import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { TagRepository } from './tag.repository';

@ObjectType()
@Entity({ customRepository: () => TagRepository })
export class Tag extends BaseEntity {
  @Field()
  @Property()
  name: string;
}
