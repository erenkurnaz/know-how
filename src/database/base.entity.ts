import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { v4 } from 'uuid';

@ObjectType()
@Entity({ abstract: true })
export abstract class Base<T extends Base<T>> extends BaseEntity<T, 'id'> {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Field(() => Date)
  @Property({ default: 'now()' })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Property({
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;
}
