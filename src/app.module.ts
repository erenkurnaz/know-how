import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import configuration, { IConfig } from '@config/configuration';
import { ApiModule } from '@api/api.module';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: [configuration],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) =>
        config.get('graphql'),
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) =>
        config.get('database'),
    }),
    ApiModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await Promise.all([
      this.orm.getSchemaGenerator().ensureDatabase(),
      this.orm.getMigrator().up(),
    ]);
  }
}
