import { IUser, USER_FRAGMENT } from '../types';

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

export interface IRefreshResult {
  user: IUser;
  accessToken: string;
}
