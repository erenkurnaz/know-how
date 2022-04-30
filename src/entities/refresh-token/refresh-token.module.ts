import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Module({
  imports: [MikroOrmModule.forFeature([RefreshToken])],
  providers: [
    {
      provide: RefreshTokenRepository,
      useFactory: (em: EntityManager) => em.getRepository(RefreshToken),
      inject: [EntityManager],
    },
  ],
  exports: [RefreshTokenRepository],
})
export class RefreshTokenModule {}
