import faker from '@faker-js/faker';
import { GqlBuilder } from '../graphql';
import { ITag } from '../graphql/types/tag-type';

export const createTag = async (accessToken: string): Promise<ITag> => {
  const { data: createdTag } = await new GqlBuilder<ITag>()
    .setMutation('CREATE_TAG_MUTATION', {
      name: faker.random.words(2),
    })
    .withAuthentication(accessToken)
    .execute();

  return createdTag;
};
