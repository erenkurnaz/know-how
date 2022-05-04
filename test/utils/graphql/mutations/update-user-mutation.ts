import {
  IUser,
  USER_FRAGMENT,
  VALIDATION_ERROR_FRAGMENT,
  SERVER_ERROR_FRAGMENT,
} from '../types';
import { gql } from '../../helpers/app.helper';

export const UPDATE_USER_MUTATION = {
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

export interface IUpdateUserInput {
  input: Omit<
    IUser,
    'id' | 'updatedAt' | 'createdAt' | 'password' | 'isFollowing'
  >;
}
