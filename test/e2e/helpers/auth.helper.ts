import {
  executeQuery,
  IErrorableResult,
  ON_ERRORABLE_RESULT,
} from './graphql.helper';
import { IUser, USER_FRAGMENT } from './user.helper';

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
export interface IRefreshResult {
  user: IUser;
  accessToken: string;
}
export interface IRegisterInput {
  email: string;
  password: string;
  fullName: string;
}
export interface ILoginInput {
  email: string;
  password: string;
}

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await registerMutation(user);

  const result = await loginMutation({
    email: user.email,
    password: user.password,
  });

  return result.data as IAuthResult;
};

export const registerMutation = async (input: IRegisterInput) => {
  const gql = {
    name: 'register',
    query: `
      mutation($email: String!, $password: String!, $fullName: String!) {
        register(input: { 
          email: $email,
          password: $password,
          fullName: $fullName
        }) {
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
    variables: input,
  };

  return await executeQuery<IErrorableResult<IAuthResult>, IRegisterInput>(gql);
};

export const loginMutation = async (input: ILoginInput) => {
  const gql = {
    name: 'login',
    query: `
      mutation($email: String!, $password: String!) {
        login(input: { 
          email: $email,
          password: $password
        }) {
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
    variables: input,
  };

  return await executeQuery<IErrorableResult<IAuthResult>, ILoginInput>(gql);
};

export const refreshMutation = async (refreshToken: string) => {
  const gql = {
    name: 'refreshAccessToken',
    query: `
      mutation {
        refreshAccessToken {
          user {
            ...UserFields
          }
          accessToken
        }
      }
      ${USER_FRAGMENT}
    `,
    token: refreshToken,
  };

  return await executeQuery<IRefreshResult>(gql);
};
