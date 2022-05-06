import { IErrorableResult, IPost, POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const DELETE_POST_MUTATION = {
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

type IPostDeleteResult = IErrorableResult<IPost>;

export const postDeleteMutation = async <
  T extends IPostDeleteResult = IPostDeleteResult,
>(
  variables: IDeletePostInput,
  token: string,
): Promise<T> => {
  const client = new GqlClient<T>(DELETE_POST_MUTATION, variables);
  if (token) client.withAuthentication(token);

  const result = await client.execute();

  return result.data;
};
