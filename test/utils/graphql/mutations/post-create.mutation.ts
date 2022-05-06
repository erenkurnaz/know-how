import {
  IPost,
  IServerError,
  IValidationError,
  POST_FRAGMENT,
} from '../object-types';
import { GqlClient, gql } from '../graphql.helper';

export const POST_CREATE_MUTATION = {
  name: 'postCreate',
  query: gql`
    mutation ($input: PostInput!) {
      postCreate(input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

interface ICreatePostInput {
  title: string;
  content: string;
  tagIds: string[];
}

type IPostCreateResult = IPost | IValidationError | IServerError;

export const postCreateMutation = async <
  T extends IPostCreateResult = IPostCreateResult,
>(
  variables: { input: ICreatePostInput },
  token: string,
): Promise<T> => {
  const client = new GqlClient<T>(POST_CREATE_MUTATION, variables);
  if (token) client.withAuthentication(token);

  const result = await client.execute();

  return result.data;
};
