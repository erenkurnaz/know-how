import faker from '@faker-js/faker';
import { ITag } from '../graphql/object-types';
import { tagCreateMutation } from '../graphql/mutations';

export const createTag = async (accessToken: string): Promise<ITag> => {
  return await tagCreateMutation<ITag>(
    {
      name: faker.random.words(2),
    },
    accessToken,
  );
};
