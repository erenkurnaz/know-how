import { GqlBuilder, IUser } from '../utils/graphql';
import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { IPost } from '../utils/graphql/types/post-type';
import { createPost } from '../utils/helpers/post.helper';
import { createTag } from '../utils/helpers/tag.helper';

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
    const TAG = await createTag(ACCESS_TOKEN);

    const { data: post } = await new GqlBuilder<IPost>()
      .setMutation('CREATE_POST_MUTATION', {
        input: {
          title: 'title',
          content: 'content',
          tagIds: [TAG.id],
        },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(post.title).toEqual('title');
    expect(post.content).toEqual('content');
    expect(post.owner).toEqual(USER);
    expect(post.tags).toEqual([TAG]);
  });

  it('should return all posts', async () => {
    const { data } = await new GqlBuilder()
      .setQuery('POSTS_QUERY', null)
      .execute();

    expect(data).toEqual([]);
  });

  it('should return posts by search keyword', async () => {
    const [POST_1] = await Promise.all([
      createPost(ACCESS_TOKEN),
      createPost(ACCESS_TOKEN),
      createPost(ACCESS_TOKEN),
    ]);

    const { data: posts } = await new GqlBuilder<IPost[]>()
      .setQuery('POST_SEARCH_QUERY', { keyword: POST_1.content })
      .execute();

    expect(posts).toEqual([POST_1]);
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
    const TAG = await createTag(ACCESS_TOKEN);
    const POST = await createPost(ACCESS_TOKEN);

    const { data: updatedPost } = await new GqlBuilder<IPost>()
      .setMutation('UPDATE_POST_MUTATION', {
        id: POST.id,
        input: { title: 'new_title', content: 'new_content', tagIds: [TAG.id] },
      })
      .withAuthentication(ACCESS_TOKEN)
      .execute();

    expect(updatedPost).toEqual({
      ...POST,
      title: 'new_title',
      content: 'new_content',
      tags: [TAG],
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
