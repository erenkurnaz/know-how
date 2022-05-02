import { TAG_FRAGMENT } from '../types/tag-type';

export const TAGS_QUERY = {
  name: 'tags',
  query: `
    query {
      tags {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};
