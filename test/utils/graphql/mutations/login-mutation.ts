import {
  USER_FRAGMENT,
  SERVER_ERROR_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../types';
import { gql } from '../../helpers/app.helper';

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
