import { POST_FRAGMENT } from '../object-types';
import { GqlClient, gql } from '../graphql.helper';
import { IPost } from '../object-types';

export const UPDATE_POST_MUTATION = {
  name: 'updatePost',
  query: gql`
    mutation ($id: String!, $input: PostInput!) {
      updatePost(id: $id, input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export interface IUpdatePostInput {
  id: string;
  input: {
    title: string;
    content: string;
    tagIds: string[];
  };
}

export const postUpdateMutation = async (
  variables: IUpdatePostInput,
  token: string,
): Promise<IPost> => {
  const result = await new GqlClient<IPost>(UPDATE_POST_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return result.data;
};
