import { gql, GqlClient } from '../graphql.helper';
import {
  IAuthResult,
  IServerError,
  IValidationError,
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../object-types';

export const REGISTER_MUTATION = {
  name: 'register',
  query: gql`
    mutation ($input: RegisterInput!) {
      register(input: $input) {
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

export interface IRegisterInput {
  input: {
    email: string;
    password: string;
    fullName: string;
  };
}

type IRegisterResult = IAuthResult | IServerError | IValidationError;

export const registerMutation = async <
  T extends IRegisterResult = IRegisterResult,
>(
  variables: IRegisterInput,
): Promise<T> => {
  const response = await new GqlClient<T>(
    REGISTER_MUTATION,
    variables,
  ).execute();

  return response.data;
};
