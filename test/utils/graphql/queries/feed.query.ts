import { gql, GqlClient } from '../graphql.helper';
import {
  IPaginatedPostResult,
  IPaginationInput,
  POST_FRAGMENT,
} from '../object-types';

const FEED_QUERY = {
  name: 'feed',
  query: gql`
    query ($pagination: PaginationInput) {
      feed(pagination: $pagination) {
        posts {
          ...PostFields
        }
        total
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const feedQuery = async (
  token: string,
  pagination?: IPaginationInput,
): Promise<IPaginatedPostResult> => {
  const response = await new GqlClient<
    IPaginatedPostResult,
    { pagination?: IPaginationInput }
  >(FEED_QUERY, {
    pagination,
  })
    .withAuthentication(token)
    .execute();
  return response.data;
};
