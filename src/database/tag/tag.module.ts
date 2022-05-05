import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Module({
  imports: [MikroOrmModule.forFeature([Tag])],
  providers: [
    {
      provide: TagRepository,
      useFactory: (em: EntityManager) => em.getRepository(Tag),
      inject: [EntityManager],
    },
  ],
  exports: [TagRepository],
})
export class TagModule {}
