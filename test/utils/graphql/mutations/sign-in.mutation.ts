import {
  IAuthResult,
  IServerError,
  IValidationError,
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const SIGN_IN_MUTATION = {
  name: 'signIn',
  query: gql`
    mutation ($input: SignInInput!) {
      signIn(input: $input) {
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

type ISignInResult = IAuthResult | IValidationError | IServerError;

export const signInMutation = async <T extends ISignInResult = ISignInResult>(
  variables: ILoginInput,
): Promise<T> => {
  const response = await new GqlClient<T>(
    SIGN_IN_MUTATION,
    variables,
  ).execute();

  return response.data;
};
