import { IUser, USER_FRAGMENT, ON_ERRORABLE_RESULT } from '../types';

export const UPDATE_USER_MUTATION = {
  name: 'updateUser',
  query: `
    mutation($input: UpdateUserInput!) {
      updateUser(input: $input) {
        ...on User {
          ...UserFields
        }
        ${ON_ERRORABLE_RESULT}
      }
    }
    ${USER_FRAGMENT}
  `,
};

export interface IUpdateUserInput {
  input: Omit<IUser, 'id' | 'updatedAt' | 'createdAt' | 'password'>;
}
