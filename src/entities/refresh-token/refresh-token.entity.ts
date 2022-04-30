import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { User } from '@entities/user';
import { RefreshTokenRepository } from './refresh-token.repository';

@Entity({ customRepository: () => RefreshTokenRepository })
export class RefreshToken {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @ManyToOne(() => User)
  user: User;

  @Property()
  token: string;

  @Property()
  expires: Date;

  @Property()
  createdAt = new Date();
}
