import { POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const POSTS_QUERY = {
  name: 'posts',
  query: gql`
    query {
      posts {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
