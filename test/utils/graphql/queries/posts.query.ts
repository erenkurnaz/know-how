import { POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';
import { IPost } from '../object-types';

export const POSTS_QUERY = {
  name: 'posts',
  query: gql`
    query ($pagination: PaginationOption) {
      posts(pagination: $pagination) {
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

export const postsQuery = async (
  option?: IPaginationOption,
): Promise<IPostsResult> => {
  const result = await new GqlClient<
    IPostsResult,
    { pagination?: IPaginationOption }
  >(POSTS_QUERY, {
    pagination: option,
  }).execute();

  return result.data;
};
