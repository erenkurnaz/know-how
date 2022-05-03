import { TAG_FRAGMENT } from '../types/tag-type';
import { gql } from '../../helpers/app.helper';

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
