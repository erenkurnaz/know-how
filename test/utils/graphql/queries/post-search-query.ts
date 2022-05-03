import { POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

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
