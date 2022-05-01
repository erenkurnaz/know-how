import {
  ILoginInput,
  IRegisterInput,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from '../graphql/mutations';
import { IRefreshResult, REFRESH_ACCESS_TOKEN_QUERY } from '../graphql/queries';
import { IAuthResult, IErrorableAuthResult, IUser } from '../graphql/types';
import { GraphQLClient } from '../graphql/graphql-client';

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await registerMutation(user);

  return (await loginMutation(user)).data as IAuthResult;
};

export const registerMutation = async ({
  email,
  password,
  fullName,
}: IRegisterInput) => {
  const gql = {
    name: REGISTER_MUTATION.name,
    query: REGISTER_MUTATION.query,
    variables: { input: { email, password, fullName } },
  };

  return await new GraphQLClient().executeQuery<
    IErrorableAuthResult,
    { input: IRegisterInput }
  >(gql);
};

export const loginMutation = async ({ email, password }: ILoginInput) => {
  const gql = {
    name: LOGIN_MUTATION.name,
    query: LOGIN_MUTATION.query,
    variables: { input: { email, password } },
  };

  return await new GraphQLClient().executeQuery<
    IErrorableAuthResult,
    { input: ILoginInput }
  >(gql);
};

export const refreshMutation = async (refreshToken: string) => {
  const gql = {
    name: REFRESH_ACCESS_TOKEN_QUERY.name,
    query: REFRESH_ACCESS_TOKEN_QUERY.query,
    token: refreshToken,
  };

  return await new GraphQLClient().executeQuery<IRefreshResult>(gql);
};
