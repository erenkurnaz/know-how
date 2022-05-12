import { gql, GqlClient } from '../graphql.helper';
import {
  IPaginatedUserResult,
  IPaginationInput,
  USER_FRAGMENT,
} from '../object-types';

export const USERS_QUERY = {
  name: 'users',
  query: gql`
    query ($keyword: String, $pagination: PaginationInput) {
      users(keyword: $keyword, pagination: $pagination) {
        users {
          ...UserFields
        }
        total
      }
    }
    ${USER_FRAGMENT}
  `,
};

interface IUsersOptions {
  keyword?: string;
  pagination: IPaginationInput;
}

export const usersQuery = async (options?: IUsersOptions) => {
  const result = await new GqlClient<IPaginatedUserResult, IUsersOptions>(
    USERS_QUERY,
    options,
  ).execute();

  return result.data;
};
