import { gql, GqlClient } from '../graphql.helper';
import {
  IAuthResult,
  IServerError,
  IValidationError,
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../object-types';

export const SIGN_UP_MUTATION = {
  name: 'signUp',
  query: gql`
    mutation ($input: SignUpInput!) {
      signUp(input: $input) {
        ... on AuthResult {
          user {
            ...UserFields
          }
          accessToken
          refreshToken
        }
        ... on ServerError {
          ...ServerErrorFields
        }
        ... on ValidationError {
          ...ValidationErrorFields
        }
      }
    }
    ${USER_FRAGMENT}
    ${SERVER_ERROR_FRAGMENT}
    ${VALIDATION_ERROR_FRAGMENT}
  `,
};

export interface ISignUpInput {
  input: {
    email: string;
    password: string;
    fullName: string;
  };
}

type ISignUpResult = IAuthResult | IServerError | IValidationError;

export const signUpMutation = async <T extends ISignUpResult = ISignUpResult>(
  variables: ISignUpInput,
): Promise<T> => {
  const response = await new GqlClient<T>(
    SIGN_UP_MUTATION,
    variables,
  ).execute();

  return response.data;
};
