import request from 'supertest';
import { ApolloError } from 'apollo-server-express';
import { APP, getConfig } from '../app';

interface RequestOptions<T> {
  name: string;
  query: string;
  variables?: T;
  token?: string;
}

export interface ApolloResponse<T> {
  data: T;
  errors?: ApolloError;
}

export class GraphQLClient {
  private readonly path: string;
  private request: request.Request;

  constructor() {
    this.path = getConfig('graphql').path;
    this.initRequest();
  }

  public async executeQuery<T, V = undefined>({
    name,
    query,
    variables,
    token,
  }: RequestOptions<V>): Promise<ApolloResponse<T>> {
    this.request.send({
      query,
      variables,
    });

    if (token) {
      this.request
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });
    }

    const { body } = await this.request;

    const errors: ApolloError = body.errors && body.errors[0];
    if (errors) {
      console.error(errors);
    }
    const data: T = body.data && body.data[name];

    return { data, errors };
  }

  private initRequest() {
    this.request = request(APP.getHttpServer()).post(`/${this.path}`);
  }
}
