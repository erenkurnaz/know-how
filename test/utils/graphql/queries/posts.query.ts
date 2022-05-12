import {
  IPaginatedPostResult,
  IPaginationInput,
  POST_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const POSTS_QUERY = {
  name: 'posts',
  query: gql`
    query ($keyword: String, $pagination: PaginationInput) {
      posts(keyword: $keyword, pagination: $pagination) {
        posts {
          ...PostFields
        }
        total
      }
    }
    ${POST_FRAGMENT}
  `,
};

interface IPostsOptions {
  keyword?: string;
  pagination?: IPaginationInput;
}

export const postsQuery = async (
  options?: IPostsOptions,
): Promise<IPaginatedPostResult> => {
  const result = await new GqlClient<IPaginatedPostResult, IPostsOptions>(
    POSTS_QUERY,
    options,
  ).execute();

  return result.data;
};
