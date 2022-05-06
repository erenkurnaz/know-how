import { POST_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';
import { IPost } from '../object-types';

export const POST_SEARCH_QUERY = {
  name: 'postSearch',
  query: gql`
    query ($keyword: String!) {
      postSearch(keyword: $keyword) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export const postSearchQuery = async (variables: {
  keyword: string;
}): Promise<IPost[]> => {
  const result = await new GqlClient<IPost[]>(
    POST_SEARCH_QUERY,
    variables,
  ).execute();

  return result.data;
};
