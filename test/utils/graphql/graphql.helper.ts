import supertest from 'supertest';
import { ApolloError } from 'apollo-server-express';
import { APP, getConfig } from '../helpers/app.helper';

export interface ApolloResponse<T> {
  data: T;
  errors?: ApolloError;
}

export class GqlClient<T, V = unknown> {
  private readonly path: string;
  private client: supertest.Request;

  constructor(
    private readonly gqlQuery: { name: string; query: string },
    private readonly variables?: V,
  ) {
    this.path = getConfig('graphql').path;
    this.initClient();
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
    if (errors) console.error(JSON.stringify(errors));

    const data: T = body.data && body.data[this.gqlQuery.name];

    return { data, errors };
  }

  private initClient() {
    this.client = supertest(APP.getHttpServer())
      .post(`/${this.path}`)
      .set('Accept', 'application/json');
  }
}

export const gql = (query: TemplateStringsArray, ...args: string[]) =>
  [...query, ...args].join('');
