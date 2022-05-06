import { USER_FRAGMENT } from '../object-types';
import { gql } from '../graphql.helper';

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
