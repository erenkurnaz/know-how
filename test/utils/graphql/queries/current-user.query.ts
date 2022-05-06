import { IUser, USER_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const CURRENT_USER_QUERY = {
  name: 'currentUser',
  query: gql`
    query {
      currentUser {
        ...UserFields
      }
    }
    ${USER_FRAGMENT}
  `,
};

export const currentUserQuery = async (token: string): Promise<IUser> => {
  const response = await new GqlClient<IUser>(CURRENT_USER_QUERY)
    .withAuthentication(token)
    .execute();
  return response.data;
};
