import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from '../base.entity';
import { UserRepository } from './user.repository';

@ObjectType()
@Entity({ customRepository: () => UserRepository })
export class User extends BaseEntity {
  @Field()
  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Field()
  @Property()
  fullName: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  instagram?: string;
}
