import { IPost } from '../graphql/object-types';
import faker from '@faker-js/faker';
import { postCreateMutation } from '../graphql/mutations';

export const createPost = async (
  accessToken: string,
  tagIds?: string[],
): Promise<IPost> => {
  return await postCreateMutation<IPost>(
    {
      input: {
        title: faker.random.words(4),
        content: faker.random.words(12),
        tagIds: tagIds || [],
      },
    },
    accessToken,
  );
};
