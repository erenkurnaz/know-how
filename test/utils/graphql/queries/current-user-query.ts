import { USER_FRAGMENT } from '../types';
import { gql } from '../../helpers/app.helper';

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
