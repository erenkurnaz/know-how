import { POST_FRAGMENT } from '../object-types';
import { GqlClient, gql } from '../graphql.helper';
import { IPost } from '../object-types';

export const POSTS_BY_USER_ID_QUERY = {
  name: 'postsByUserId',
  query: gql`
    query ($userId: String!) {
      postsByUserId(userId: $userId) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const postsByUserIdQuery = async (variables: {
  userId: string;
}): Promise<IPost[]> => {
  const result = await new GqlClient<IPost[]>(
    POSTS_BY_USER_ID_QUERY,
    variables,
  ).execute();

  return result.data;
};
