import { POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';
import { IPost } from '../object-types';

export const POSTS_QUERY = {
  name: 'posts',
  query: gql`
    query {
      posts {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const postsQuery = async (): Promise<IPost[]> => {
  const result = await new GqlClient<IPost[]>(POSTS_QUERY).execute();

  return result.data;
};
