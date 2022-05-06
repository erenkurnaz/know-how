import { gql, GqlClient } from '../graphql.helper';
import { IServerError, IUser, USER_FRAGMENT } from '../object-types';

export const USER_FOLLOW_MUTATION = {
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

type IUserFollowResult = IUser | IServerError;

export const userFollowMutation = async <T extends IUserFollowResult>(
  variables: IFollowUserInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(USER_FOLLOW_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
