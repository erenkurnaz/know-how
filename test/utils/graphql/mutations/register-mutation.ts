import { ON_ERRORABLE_RESULT, USER_FRAGMENT } from '../types';

export const REGISTER_MUTATION = {
  name: 'register',
  query: `
    mutation($input: RegisterInput!) {
      register(input: $input) {
        ... on AuthResult {
          user {
            ...UserFields
          }
          accessToken
          refreshToken
        }
        ${ON_ERRORABLE_RESULT}
      }
    }
    ${USER_FRAGMENT}
  `,
};

export interface IRegisterInput {
  input: {
    email: string;
    password: string;
    fullName: string;
  };
}
