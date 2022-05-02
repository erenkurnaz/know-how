import { GqlBuilder, IUser } from '../utils/graphql';
import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { IPost } from '../utils/graphql/types/post-type';
import { createPost } from '../utils/helpers/post.helper';

describe('Post', () => {
  let USER: IUser;
  let ACCESS_TOKEN: string;
  beforeEach(async () => {
    await clearDatabase();

    const { user, accessToken } = await authorizeUser(createUserMock());
    USER = user;
    ACCESS_TOKEN = accessToken;
  });

  it('should create and return created post', async () => {
    const res = await new GqlBuilder<IPost>()
      .setMutation('CREATE_POST_MUTATION', {
        input: {
          title: 'title',
          content: 'content',
          tagIds: [],
        },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(res.data.title).toEqual('title');
    expect(res.data.content).toEqual('content');
    expect(res.data.owner).toEqual(USER);
  });

  it('should return all posts', async () => {
    const { data } = await new GqlBuilder()
      .setQuery('POSTS_QUERY', null)
      .execute();

    expect(data).toEqual([]);
  });

  it('should return posts by userId', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const { data: posts } = await new GqlBuilder<IPost[]>()
      .setQuery('POSTS_BY_USER_ID_QUERY', { userId: USER.id })
      .execute();

    expect(posts).toEqual([POST]);
  });

  it('should return post by id', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const { data: post } = await new GqlBuilder<IPost>()
      .setQuery('POST_QUERY', { id: POST.id })
      .execute();

    expect(post).toMatchObject(POST);
  });

  it('should update and return updated post', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const { data: updatedPost } = await new GqlBuilder<IPost>()
      .setMutation('UPDATE_POST_MUTATION', {
        id: POST.id,
        input: { title: 'new_title', content: 'new_content', tagIds: [] },
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

  it('should delete and return success status', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const { data: deletedPost } = await new GqlBuilder<IPost>()
      .setMutation('DELETE_POST_MUTATION', { id: POST.id })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(deletedPost).toEqual(POST);
  });
});
