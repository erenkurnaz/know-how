import { USER_FRAGMENT } from '../object-types';
import { gql } from '../graphql.helper';

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
