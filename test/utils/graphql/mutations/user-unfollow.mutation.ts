import { gql, GqlClient } from '../graphql.helper';
import { IServerError, IUser, USER_FRAGMENT } from '../object-types';

export const USER_UNFOLLOW_MUTATION = {
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

type IUnfollowUserInput = { userId: string };

type IUserUnfollowResult = IUser | IServerError;

export const userUnfollowMutation = async <T extends IUserUnfollowResult>(
  variables: IUnfollowUserInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(USER_UNFOLLOW_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
