import {
  IPaginatedTagResult,
  IPaginationInput,
  TAG_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const TAGS_QUERY = {
  name: 'tags',
  query: gql`
    query ($pagination: PaginationInput) {
      tags(pagination: $pagination) {
        tags {
          ...TagFields
        }
        total
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export const tagsQuery = async (
  pagination?: IPaginationInput,
): Promise<IPaginatedTagResult> => {
  const result = await new GqlClient<IPaginatedTagResult>(TAGS_QUERY, {
    pagination,
  }).execute();
  return result.data;
};
