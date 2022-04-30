import faker from '@faker-js/faker';
import {
  executeQuery,
  IErrorableResult,
  ON_ERRORABLE_RESULT,
} from './graphql.helper';

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export type IUpdateUserInput = Omit<
  IUser,
  'id' | 'updatedAt' | 'createdAt' | 'password'
>;

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
    name: 'currentUser',
    query: `
      query {
        currentUser {
          ...UserFields
        }
      }
      ${USER_FRAGMENT}
    `,
    token: accessToken,
  };

  return await executeQuery<IUser>(gql);
};

export const updateUserMutation = async (user: IUser, accessToken?: string) => {
  const gql = {
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

  return await executeQuery<
    IErrorableResult<IUser>,
    { input: IUpdateUserInput }
  >(gql);
};

export const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    email
    fullName
    github
    linkedin
    twitter
    instagram
    createdAt
    updatedAt
  }
`;
