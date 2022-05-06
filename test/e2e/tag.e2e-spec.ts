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
import { IServerError, ITag } from '../utils/graphql/object-types';

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
      const favoriteTag = await tagFavoriteMutation<ITag>(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );

      expect(favoriteTag).toEqual({
        ...INITIAL_TAG,
        isFavorite: true,
      });
    });

    it('should fail if tag already in favorites', async () => {
      const favoriteTag = await tagFavoriteMutation<ITag>(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );
      const error = await tagFavoriteMutation<IServerError>(
        { id: favoriteTag.id },
        ACCESS_TOKEN,
      );

      expect(error.status).toEqual(500);
      expect(error.message).toContain('Tag already added to favorites');
    });
  });

  describe('when user remove tag from favorite', () => {
    it('should return unfavorited tag', async () => {
      const FAVORITED_TAG = await tagFavoriteMutation<ITag>(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );

      const unfavoritedTag = await tagUnfavoriteMutation<ITag>(
        { id: FAVORITED_TAG.id },
        ACCESS_TOKEN,
      );

      expect(FAVORITED_TAG.isFavorite).toEqual(true);
      expect(unfavoritedTag.isFavorite).toEqual(false);
    });

    it('should fail if tag not in favorites', async () => {
      const error = await tagUnfavoriteMutation<IServerError>(
        { id: INITIAL_TAG.id },
        ACCESS_TOKEN,
      );

      expect(error.status).toEqual(500);
      expect(error.message).toContain('Tag not in favorites');
    });
  });

  it('should create tag and return created tag', async () => {
    const tag = await tagCreateMutation<ITag>(
      { name: 'new tag' },
      ACCESS_TOKEN,
    );

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
