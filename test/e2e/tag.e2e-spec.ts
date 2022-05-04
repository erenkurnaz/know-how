import { clearDatabase } from '../utils/helpers/app.helper';
import { GqlBuilder } from '../utils/graphql';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { ITag } from '../utils/graphql/types/tag-type';
import { createTag } from '../utils/helpers/tag.helper';

describe('Tags', () => {
  let ACCESS_TOKEN: string;
  let INITIAL_TAG: ITag;

  beforeEach(async () => {
    await clearDatabase();

    const { accessToken } = await authorizeUser(createUserMock());
    ACCESS_TOKEN = accessToken;

    INITIAL_TAG = await createTag(ACCESS_TOKEN);
  });

  describe('when user add tag to favorite', () => {
    it('should return favorited tag', async () => {
      const { data: favoriteTag } = await new GqlBuilder<ITag>()
        .setMutation('FAVORITE_TAG_MUTATION', {
          id: INITIAL_TAG.id,
        })
        .withAuthentication(ACCESS_TOKEN)
        .execute();

      expect(favoriteTag).toEqual({
        ...INITIAL_TAG,
        isFavorite: true,
      });
    });
  });

  describe('when user remove tag from favorite', () => {
    it('should return unfavorited tag', async () => {
      const { data: FAVORITED_TAG } = await new GqlBuilder<ITag>()
        .setMutation('FAVORITE_TAG_MUTATION', {
          id: INITIAL_TAG.id,
        })
        .withAuthentication(ACCESS_TOKEN)
        .execute();

      const { data: unfavoritedTag } = await new GqlBuilder<ITag>()
        .setMutation('UNFAVORITE_TAG_MUTATION', {
          id: FAVORITED_TAG.id,
        })
        .withAuthentication(ACCESS_TOKEN)
        .execute();

      expect(FAVORITED_TAG.isFavorite).toEqual(true);
      expect(unfavoritedTag.isFavorite).toEqual(false);
    });
  });

  it('should create tag and return created tag', async () => {
    const { data: tag } = await new GqlBuilder<ITag>()
      .setMutation('CREATE_TAG_MUTATION', {
        name: 'new tag',
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(tag).toEqual({
      id: expect.any(String),
      name: 'new tag',
      isFavorite: false,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  it('should return all tags', async () => {
    const TAG = await createTag(ACCESS_TOKEN);

    const { data: tags } = await new GqlBuilder()
      .setQuery('TAGS_QUERY', null)
      .execute();

    expect(tags).toEqual([INITIAL_TAG, TAG]);
  });
});
