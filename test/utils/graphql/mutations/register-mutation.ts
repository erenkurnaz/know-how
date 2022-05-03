import {
  SERVER_ERROR_FRAGMENT,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
} from '../types';
import { gql } from '../../helpers/app.helper';

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
