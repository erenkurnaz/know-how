import {
  IPost,
  IServerError,
  IValidationError,
  POST_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const POST_DELETE_MUTATION = {
  name: 'postDelete',
  query: gql`
    mutation ($id: String!) {
      postDelete(id: $id) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export interface IDeletePostInput {
  id: string;
}

type IPostDeleteResult = IPost | IValidationError | IServerError;

export const postDeleteMutation = async <
  T extends IPostDeleteResult = IPostDeleteResult,
>(
  variables: IDeletePostInput,
  token: string,
): Promise<T> => {
  const client = new GqlClient<T>(POST_DELETE_MUTATION, variables);
  if (token) client.withAuthentication(token);

  const result = await client.execute();

  return result.data;
};
