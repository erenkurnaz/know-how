import { IAuthResult, USER_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

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

export const refreshAccessTokenQuery = async (
  refreshToken: string,
): Promise<IAuthResult> => {
  const response = await new GqlClient<IAuthResult>(REFRESH_ACCESS_TOKEN_QUERY)
    .withAuthentication(refreshToken)
    .execute();
  return response.data;
};
