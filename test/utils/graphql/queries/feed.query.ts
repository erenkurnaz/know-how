import { gql, GqlClient } from '../graphql.helper';
import { IPost, POST_FRAGMENT } from '../object-types';

const FEED_QUERY = {
  name: 'feed',
  query: gql`
    query {
      feed {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const feedQuery = async (token: string): Promise<IPost[]> => {
  const response = await new GqlClient<IPost[]>(FEED_QUERY)
    .withAuthentication(token)
    .execute();
  return response.data;
};
