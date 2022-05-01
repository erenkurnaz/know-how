import supertest from 'supertest';
import { ApolloError } from 'apollo-server-express';
import { APP, getConfig } from '../helpers/app.helper';

interface IQuery {
  name: string;
  query: string;
}

export interface ApolloResponse<T> {
  data: T;
  errors?: ApolloError;
}

export class GqlBuilder<T = unknown, V = unknown> {
  private readonly path: string;
  private gqlQuery: IQuery;
  private variables: V;
  private client: supertest.Request;

  constructor() {
    this.path = getConfig('graphql').path;
    this.initClient();
  }

  public setQuery(query: IQuery) {
    this.gqlQuery = query;

    return this;
  }

  public setVariables(variables: V) {
    this.variables = variables;

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
