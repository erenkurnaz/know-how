import { POST_FRAGMENT } from '../object-types';
import { GqlClient, gql } from '../graphql.helper';
import { IPost } from '../object-types';

export const POST_QUERY = {
  name: 'post',
  query: gql`
    query ($id: String!) {
      post(id: $id) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const postQuery = async (variables: {
  id: string;
}): Promise<IPost[]> => {
  const result = await new GqlClient<IPost[]>(POST_QUERY, variables).execute();

  return result.data;
};
