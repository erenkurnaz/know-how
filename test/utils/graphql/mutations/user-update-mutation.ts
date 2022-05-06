import { gql, GqlClient } from '../graphql.helper';
import {
  IServerError,
  IUser,
  IValidationError,
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../object-types';

export const USER_UPDATE_MUTATION = {
  name: 'updateUser',
  query: gql`
    mutation ($input: UpdateUserInput!) {
      updateUser(input: $input) {
        ... on User {
          ...UserFields
        }
        ... on ValidationError {
          ...ValidationErrorFields
        }
        ... on ServerError {
          ...ServerErrorFields
        }
      }
    }
    ${USER_FRAGMENT}
    ${VALIDATION_ERROR_FRAGMENT}
    ${SERVER_ERROR_FRAGMENT}
  `,
};

interface IUpdateUserInput {
  input: Omit<
    IUser,
    'id' | 'updatedAt' | 'createdAt' | 'password' | 'isFollowing'
  >;
}

type IUpdateUserResult = IUser | IValidationError | IServerError;

export const userUpdateMutation = async <
  T extends IUpdateUserResult = IUpdateUserResult,
>(
  variables: IUpdateUserInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(USER_UPDATE_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
