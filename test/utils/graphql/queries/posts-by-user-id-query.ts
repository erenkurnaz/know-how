import { POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const POSTS_BY_USER_ID_QUERY = {
  name: 'postsByUserId',
  query: gql`
    query ($userId: String!) {
      postsByUserId(userId: $userId) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
