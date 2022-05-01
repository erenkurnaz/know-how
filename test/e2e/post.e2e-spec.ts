import { GqlBuilder, IUser } from '../utils/graphql';
import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { POSTS_QUERY } from '../utils/graphql/queries/posts-query';

describe('Post', () => {
  let USER: IUser;
  let ACCESS_TOKEN: string;
  beforeEach(async () => {
    await clearDatabase();
    const { user, accessToken } = await authorizeUser(createUserMock());
    USER = user;
    ACCESS_TOKEN = accessToken;
  });

  it('should return all posts', async () => {
    const { data } = await new GqlBuilder().setQuery(POSTS_QUERY).execute();

    expect(data).toEqual([]);
  });

  it.todo('should return posts by userId');

  it.todo('should return post by id');

  it.todo('should create and return updated post');

  it.todo('should update and return updated post');

  it.todo('should delete and return success status');
});
