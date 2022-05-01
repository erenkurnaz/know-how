import { USER_FRAGMENT } from '../types';

export const CURRENT_USER_QUERY = {
  name: 'currentUser',
  query: `
    query {
      currentUser {
        ...UserFields
      }
    }
    ${USER_FRAGMENT}
  `,
};
