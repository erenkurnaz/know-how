import { TAG_FRAGMENT } from '../object-types';
import { gql } from '../graphql.helper';

export const TAGS_QUERY = {
  name: 'tags',
  query: gql`
    query {
      tags {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};
