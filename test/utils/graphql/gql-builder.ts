import supertest from 'supertest';
import { ApolloError } from 'apollo-server-express';
import { APP, getConfig } from '../helpers/app.helper';
import * as MUTATIONS from './mutations/index';
import * as QUERIES from './queries/index';
import { MutationInput } from './mutations/input-types';
import { QueryInput } from './queries/query-inputs';

type Mutation = keyof typeof MUTATIONS;
type Query = keyof typeof QUERIES;

export interface ApolloResponse<T> {
  data: T;
  errors?: ApolloError;
}

export class GqlBuilder<T = unknown> {
  private readonly path: string;
  private gqlQuery: { name: string; query: string };
  private variables: QueryInput<Query> | MutationInput<Mutation>;
  private client: supertest.Request;

  constructor() {
    this.path = getConfig('graphql').path;
    this.initClient();
  }

  public setQuery<Q extends Query>(query: Q, input: QueryInput<Q>) {
    this.gqlQuery = QUERIES[query];

    if (input) this.variables = input;

    return this;
  }

  public setMutation<M extends Mutation>(mutation: M, input: MutationInput<M>) {
    this.gqlQuery = MUTATIONS[mutation];

    if (input) this.variables = input;

    return this;
  }

  public withAuthentication(token: string) {
    this.client.auth(token, { type: 'bearer' });

    return this;
  }

  public async execute(): Promise<ApolloResponse<T>> {
    const { body } = await this.client.send({
      query: this.gqlQuery.query,
      variables: { ...this.variables },
    });

    const errors: ApolloError = body.errors && body.errors[0];
    if (errors) console.error(errors);

    const data: T = body.data && body.data[this.gqlQuery.name];

    return { data, errors };
  }

  private initClient() {
    this.client = supertest(APP.getHttpServer())
      .post(`/${this.path}`)
      .set('Accept', 'application/json');
  }
}
