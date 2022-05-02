import { IPost } from '../graphql/types/post-type';
import faker from '@faker-js/faker';
import { GqlBuilder } from '../graphql';

export const createPost = async (
  accessToken: string,
  tagIds?: string[],
): Promise<IPost> => {
  const { data: createdPost } = await new GqlBuilder<IPost>()
    .setMutation('CREATE_POST_MUTATION', {
      input: {
        title: faker.random.words(4),
        content: faker.random.words(12),
        tagIds: tagIds || [],
      },
    })
    .withAuthentication(accessToken)
    .execute();

  return createdPost;
};
