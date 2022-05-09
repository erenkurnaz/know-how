import { gql, GqlClient } from '../graphql.helper';
import {
  IPaginatedPostResult,
  IPaginationOption,
  POST_FRAGMENT,
} from '../object-types';

const FEED_QUERY = {
  name: 'feed',
  query: gql`
    query ($pagination: PaginationOption) {
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
  pagination?: IPaginationOption,
): Promise<IPaginatedPostResult> => {
  const response = await new GqlClient<
    IPaginatedPostResult,
    { pagination?: IPaginationOption }
  >(FEED_QUERY, {
    pagination,
  })
    .withAuthentication(token)
    .execute();
  return response.data;
};
