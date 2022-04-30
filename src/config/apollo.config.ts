import { ApolloDriverConfig } from '@nestjs/apollo';

export default (): ApolloDriverConfig => ({
  path: process.env.GRAPHQL_PATH || 'api',
  autoSchemaFile: './src/schema.gql',
  sortSchema: true,
  playground: Boolean(process.env.GRAPHQL_PLAYGROUND) || true,
  debug: Boolean(process.env.GRAPHQL_DEBUG) || true,
});
