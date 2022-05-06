import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class Base<T extends Base<T>> extends BaseEntity<T, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ default: 'now()' })
  createdAt: Date;

  @Property({
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;
}
