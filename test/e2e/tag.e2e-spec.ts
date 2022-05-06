import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { createTag } from '../utils/helpers/tag.helper';
import {
  tagCreateMutation,
  tagFavoriteMutation,
  tagUnfavoriteMutation,
} from '../utils/graphql/mutations';
import { tagsQuery } from '../utils/graphql/queries';
import { ITag } from '../utils/graphql/object-types';

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
      const favoriteTag = await tagFavoriteMutation(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );

      expect(favoriteTag).toEqual({
        ...INITIAL_TAG,
        isFavorite: true,
      });
    });
  });

  describe('when user remove tag from favorite', () => {
    it('should return unfavorited tag', async () => {
      const FAVORITED_TAG = await tagFavoriteMutation(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );

      const unfavoritedTag = await tagUnfavoriteMutation(
        { id: FAVORITED_TAG.id },
        ACCESS_TOKEN,
      );

      expect(FAVORITED_TAG.isFavorite).toEqual(true);
      expect(unfavoritedTag.isFavorite).toEqual(false);
    });
  });

  it('should create tag and return created tag', async () => {
    const tag = await tagCreateMutation({ name: 'new tag' }, ACCESS_TOKEN);

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

    const tags = await tagsQuery();

    expect(tags).toEqual([INITIAL_TAG, TAG]);
  });
});
