import faker from '@faker-js/faker';

import { IUpdateUserInput, UPDATE_USER_MUTATION } from '../graphql/mutations';
import { CURRENT_USER_QUERY } from '../graphql/queries';
import { IErrorableUserResult, IUser } from '../graphql/types';
import { GraphQLClient } from '../graphql/graphql-client';

export function createUserMock(from?: Partial<IUser>): IUser {
  return {
    id: '',
    email: faker.internet.email(),
    password: faker.internet.password(8),
    fullName: faker.internet.userName(),
    github: faker.internet.domainName(),
    linkedin: faker.internet.domainName(),
    twitter: faker.internet.domainName(),
    instagram: faker.internet.domainName(),
    createdAt: new Date().toISOString(),
    updatedAt: null,
    ...from,
  };
}

export const currentUserQuery = async (accessToken?: string) => {
  const gql = {
    name: CURRENT_USER_QUERY.name,
    query: CURRENT_USER_QUERY.query,
    token: accessToken,
  };

  return await new GraphQLClient().executeQuery<IUser>(gql);
};

export const updateUserMutation = async (user: IUser, accessToken?: string) => {
  const gql = {
    name: UPDATE_USER_MUTATION.name,
    query: UPDATE_USER_MUTATION.query,
    variables: {
      input: {
        fullName: user.fullName,
        email: user.email,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        instagram: user.instagram,
      },
    },
    token: accessToken,
  };

  return await new GraphQLClient().executeQuery<
    IErrorableUserResult,
    { input: IUpdateUserInput }
  >(gql);
};
