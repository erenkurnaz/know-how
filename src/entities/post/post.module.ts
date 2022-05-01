import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Module({
  imports: [MikroOrmModule.forFeature([Post])],
  providers: [
    {
      provide: PostRepository,
      useFactory: (em: EntityManager) => em.getRepository(Post),
      inject: [EntityManager],
    },
  ],
  exports: [PostRepository],
})
export class PostModule {}
