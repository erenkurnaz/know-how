import {
  POSTS_QUERY,
  CREATE_POST_MUTATION,
  POST_QUERY,
  GqlBuilder,
  IUser,
  POST_BY_USER_ID_QUERY,
  UPDATE_POST_MUTATION,
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

  it('should return posts by userId', async () => {
    const { data: USER_POST } = await new GqlBuilder()
      .setQuery(CREATE_POST_MUTATION)
      .setVariables({ input: { title: 'title', content: 'content' } })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    const { data: posts } = await new GqlBuilder<IPost[]>()
      .setQuery(POST_BY_USER_ID_QUERY)
      .setVariables({ userId: USER.id })
      .execute();

    expect(posts).toEqual([USER_POST]);
  });

  it('should return post by id', async () => {
    const { data: CREATED_POST } = await new GqlBuilder<IPost>()
      .setQuery(CREATE_POST_MUTATION)
      .setVariables({
        input: {
          title: 'title',
          content: 'content',
        },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    const { data: post } = await new GqlBuilder<IPost>()
      .setQuery(POST_QUERY)
      .setVariables({ id: CREATED_POST.id })
      .execute();

    expect(post).toMatchObject(CREATED_POST);
  });

  it('should update and return updated post', async () => {
    const { data: POST } = await new GqlBuilder<IPost>()
      .setQuery(CREATE_POST_MUTATION)
      .setVariables({ input: { title: 'title', content: 'content' } })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    const { data: updatedPost } = await new GqlBuilder<IPost>()
      .setQuery(UPDATE_POST_MUTATION)
      .setVariables({
        id: POST.id,
        input: { title: 'new_title', content: 'new_content' },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(updatedPost).toEqual({
      ...POST,
      title: 'new_title',
      content: 'new_content',
      updatedAt: expect.any(String),
    });
  });

  it.todo('should delete and return success status');
});
