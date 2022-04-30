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

export const executeQuery = async <T, V = undefined>({
  name,
  query,
  variables,
  token,
}: RequestOptions<V>): Promise<ApolloResponse<T>> => {
  const { path } = getConfig('graphql');
  const req = request(APP.getHttpServer()).post(`/${path}`).send({
    query,
    variables,
  });

  if (token) {
    req
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  const { body } = await req;

  const errors: ApolloError = body.errors && body.errors[0];
  if (errors) {
    console.error(JSON.stringify(errors));
  }
  const data: T = body.data && body.data[name];

  return { data, errors };
};
