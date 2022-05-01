import {
  POSTS_QUERY,
  CREATE_POST_MUTATION,
  GqlBuilder,
  IUser,
} from '../utils/graphql';
import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { IPost } from '../utils/graphql/types/post-type';

describe('Post', () => {
  let USER: IUser;
  let ACCESS_TOKEN: string;
  beforeEach(async () => {
    await clearDatabase();
    const { user, accessToken } = await authorizeUser(createUserMock());
    USER = user;
    ACCESS_TOKEN = accessToken;
  });

  it('should create and return updated post', async () => {
    const res = await new GqlBuilder<IPost>()
      .setQuery(CREATE_POST_MUTATION)
      .setVariables({
        input: {
          title: 'title',
          content: 'content',
        },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(res.data.title).toEqual('title');
    expect(res.data.content).toEqual('content');
    expect(res.data.owner).toEqual(USER);
  });

  it('should return all posts', async () => {
    const { data } = await new GqlBuilder().setQuery(POSTS_QUERY).execute();

    expect(data).toEqual([]);
  });

  it.todo('should return posts by userId');

  it.todo('should return post by id');

  it.todo('should update and return updated post');

  it.todo('should delete and return success status');
});
