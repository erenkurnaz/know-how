import {
  IAuthResult,
  IServerError,
  IValidationError,
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const LOGIN_MUTATION = {
  name: 'login',
  query: gql`
    mutation ($input: LoginInput!) {
      login(input: $input) {
        ... on AuthResult {
          user {
            ...UserFields
          }
          accessToken
          refreshToken
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

export interface ILoginInput {
  input: {
    email: string;
    password: string;
  };
}

type ILoginResult = IAuthResult | IValidationError | IServerError;

export const signInMutation = async <T extends ILoginResult = ILoginResult>(
  variables: ILoginInput,
): Promise<T> => {
  const response = await new GqlClient<T>(LOGIN_MUTATION, variables).execute();

  return response.data;
};
