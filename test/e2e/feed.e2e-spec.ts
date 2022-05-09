import { clearDatabase } from '../utils/helpers/app.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { feedQuery } from '../utils/graphql/queries';
import { IAuthResult, IPost, ITag, IUser } from '../utils/graphql/object-types';
import { createTag } from '../utils/helpers/tag.helper';
import { createPost } from '../utils/helpers/post.helper';
import {
  tagFavoriteMutation,
  userFollowMutation,
} from '../utils/graphql/mutations';

describe('Feed', () => {
  let AUTH_RESULT: IAuthResult;
  let TAG: ITag;
  let POST: IPost;

  beforeEach(async () => {
    await clearDatabase();
    AUTH_RESULT = await authorizeUser(createUserMock());
    TAG = await createTag(AUTH_RESULT.accessToken);
    POST = await createPost(AUTH_RESULT.accessToken, [TAG.id]);

    const unfollowedUser = await authorizeUser(createUserMock());
    const unfollowedTag = await createTag(unfollowedUser.accessToken);
    await createPost(unfollowedUser.accessToken, [unfollowedTag.id]);
  });

  it('should return posts by followed user', async () => {
    const currentUser = await authorizeUser(createUserMock());
    const followedUser = await userFollowMutation<IUser>(
      { userId: AUTH_RESULT.user.id },
      currentUser.accessToken,
    );

    const result = await feedQuery(currentUser.accessToken);

    expect(followedUser.id).toEqual(AUTH_RESULT.user.id);
    expect(result.posts).toMatchObject([POST]);
  });

  it('should return posts by favorited tag', async () => {
    const currentUser = await authorizeUser(createUserMock());
    const followedTag = await tagFavoriteMutation<ITag>(
      { id: TAG.id },
      currentUser.accessToken,
    );

    const result = await feedQuery(currentUser.accessToken);

    expect(followedTag.id).toEqual(TAG.id);
    expect(result.posts).toMatchObject([POST]);
  });
});
