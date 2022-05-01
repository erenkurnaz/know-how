import { POST_FRAGMENT } from '../types/post-type';

export const POST_BY_USER_ID_QUERY = {
  name: 'postsByUserId',
  query: `
    query($userId: String!) {
      postsByUserId(userId: $userId) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
