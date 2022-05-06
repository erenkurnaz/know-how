import { gql } from '../graphql.helper';
import { USER_FRAGMENT } from '../object-types';

export const FOLLOW_USER_MUTATION = {
  name: 'followUser',
  query: gql`
    mutation ($userId: String!) {
      followUser(userId: $userId) {
        ...UserFields
      }
    }
    ${USER_FRAGMENT}
  `,
};

export type IFollowUserInput = { userId: string };
