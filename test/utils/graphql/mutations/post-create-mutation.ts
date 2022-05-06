import { IPost, POST_FRAGMENT } from '../object-types';
import { GqlClient, gql } from '../graphql.helper';

export const CREATE_POST_MUTATION = {
  name: 'createPost',
  query: gql`
    mutation ($input: PostInput!) {
      createPost(input: $input) {
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

export const postCreateMutation = async (
  variables: { input: ICreatePostInput },
  token: string,
): Promise<IPost> => {
  const client = new GqlClient<IPost>(CREATE_POST_MUTATION, variables);
  if (token) client.withAuthentication(token);

  const result = await client.execute();

  return result.data;
};
