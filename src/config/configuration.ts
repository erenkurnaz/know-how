import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ApolloDriverConfig } from '@nestjs/apollo';

import dbConfig from './db.config';
import apolloConfig from './apollo.config';

export interface IConfig {
  port: number;
  database: MikroOrmModuleOptions;
  graphql: ApolloDriverConfig;
  jwtSecret: string;
}

export default (): IConfig => ({
  port: 3000,
  database: dbConfig(),
  graphql: apolloConfig(),
  jwtSecret: process.env.JWT_SECRET || 'topsecurejsonwebtokensecret',
});
