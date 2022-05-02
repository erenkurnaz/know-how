import { USER_FRAGMENT, ON_ERRORABLE_RESULT } from '../types';

export const LOGIN_MUTATION = {
  name: 'login',
  query: `
    mutation($input: LoginInput!) {
      login(input: $input) {
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

export interface ILoginInput {
  input: {
    email: string;
    password: string;
  };
}
