import { POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';
import { IPost } from '../object-types';

export const POSTS_QUERY = {
  name: 'posts',
  query: gql`
    query ($keyword: String, $pagination: PaginationOption) {
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

interface IPaginationOption {
  limit: number;
  offset: number;
}

interface IPostsResult {
  posts: IPost[];
  total: number;
}

interface IPostsOptions {
  keyword?: string;
  pagination?: IPaginationOption;
}

export const postsQuery = async (
  options?: IPostsOptions,
): Promise<IPostsResult> => {
  const result = await new GqlClient<IPostsResult, IPostsOptions>(
    POSTS_QUERY,
    options,
  ).execute();

  return result.data;
};
