import faker from '@faker-js/faker';

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

export function createUserMock(from?: Partial<IUser>): Promise<IUser> {
  return new Promise((resolve, reject) => {
    const createdUser: IUser = {
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
    github
    linkedin
    twitter
    instagram
    createdAt
    updatedAt
  }
`;
