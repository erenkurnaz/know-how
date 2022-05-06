import faker from '@faker-js/faker';

import { IUser } from '../graphql/object-types';

export function createUserMock(from?: Partial<IUser>): IUser {
  return {
    id: '',
    email: faker.internet.email(),
    password: faker.internet.password(8),
    fullName: faker.internet.userName(),
    isFollowing: null,
    github: faker.internet.domainName(),
    linkedin: faker.internet.domainName(),
    twitter: faker.internet.domainName(),
    instagram: faker.internet.domainName(),
    createdAt: new Date().toISOString(),
    updatedAt: null,
    ...from,
  };
}
