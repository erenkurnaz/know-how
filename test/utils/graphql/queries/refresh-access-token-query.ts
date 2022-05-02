import { USER_FRAGMENT } from '../types';

export const REFRESH_ACCESS_TOKEN_QUERY = {
  name: 'refreshAccessToken',
  query: `
    query {
      refreshAccessToken {
        user {
          ...UserFields
        }
        accessToken
      }
    }
    ${USER_FRAGMENT}
  `,
};
