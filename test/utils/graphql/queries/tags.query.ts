import {
  IPaginatedTagResult,
  IPaginationOption,
  TAG_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const TAGS_QUERY = {
  name: 'tags',
  query: gql`
    query ($pagination: PaginationOption) {
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
  pagination?: IPaginationOption,
): Promise<IPaginatedTagResult> => {
  const result = await new GqlClient<IPaginatedTagResult>(TAGS_QUERY, {
    pagination,
  }).execute();
  return result.data;
};
