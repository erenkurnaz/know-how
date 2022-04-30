import faker from '@faker-js/faker';

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
  updatedAt: string | null;
}

export function createUserMock(from?: Partial<IUser>): Promise<IUser> {
  return new Promise((resolve, reject) => {
    const createdUser = {
      id: '',
      email: faker.internet.email(),
      password: faker.internet.password(8),
      fullName: faker.internet.userName(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      ...from,
    };
    createdUser
      ? resolve(createdUser)
      : reject(new Error('An error occurred while user mock created'));
  });
}

export const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    email
    fullName
    createdAt
    updatedAt
  }
`;
