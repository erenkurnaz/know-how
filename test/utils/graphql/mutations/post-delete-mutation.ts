import { IPost, POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const DELETE_POST_MUTATION = {
  name: 'deletePost',
  query: gql`
    mutation ($id: String!) {
      deletePost(id: $id) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export interface IDeletePostInput {
  id: string;
}

export const postDeleteMutation = async (
  variables: IDeletePostInput,
  token: string,
): Promise<IPost> => {
  const client = new GqlClient<IPost>(DELETE_POST_MUTATION, variables);
  if (token) client.withAuthentication(token);

  const result = await client.execute();

  return result.data;
};
