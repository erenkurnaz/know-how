import faker from '@faker-js/faker';
import { ITag } from '../graphql/object-types';
import { tagCreateMutation } from '../graphql/mutations/create-tag-mutation';

export const createTag = async (accessToken: string): Promise<ITag> => {
  return await tagCreateMutation(
    {
      name: faker.random.words(2),
    },
    accessToken,
  );
};
