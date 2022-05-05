import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => em.getRepository(User),
      inject: [EntityManager],
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
