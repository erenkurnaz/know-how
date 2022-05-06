import { gql } from '../graphql.helper';
import { USER_FRAGMENT } from '../object-types';

export const UNFOLLOW_USER_MUTATION = {
  name: 'unfollowUser',
  query: gql`
    mutation ($userId: String!) {
      unfollowUser(userId: $userId) {
        ...UserFields
      }
    }
    ${USER_FRAGMENT}
  `,
};

export type IUnfollowUserInput = { userId: string };
