import { USER_FRAGMENT } from '../types';
import { gql } from '../../helpers/app.helper';

export const REFRESH_ACCESS_TOKEN_QUERY = {
  name: 'refreshAccessToken',
  query: gql`
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
