import { clearDatabase } from '../utils/helpers/app.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { createPost } from '../utils/helpers/post.helper';
import { createTag } from '../utils/helpers/tag.helper';

import {
  postsByUserIdQuery,
  postQuery,
  postSearchQuery,
  postsQuery,
} from '../utils/graphql/queries';
import {
  postUpdateMutation,
  postDeleteMutation,
  postCreateMutation,
} from '../utils/graphql/mutations';
import { IPost, IUser } from '../utils/graphql/object-types';

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

    const post = await postCreateMutation<IPost>(
      {
        input: {
          title: 'title',
          content: 'content',
          tagIds: [TAG.id],
        },
      },
      ACCESS_TOKEN,
    );

    expect(post.title).toEqual('title');
    expect(post.content).toEqual('content');
    expect(post.owner).toEqual(USER);
    expect(post.tags).toEqual([TAG]);
  });

  it('should return all posts', async () => {
    const posts = await postsQuery();

    expect(posts).toEqual([]);
  });

  it('should return posts by search keyword', async () => {
    const [POST_1] = await Promise.all([
      createPost(ACCESS_TOKEN),
      createPost(ACCESS_TOKEN),
      createPost(ACCESS_TOKEN),
    ]);

    const posts = await postSearchQuery({ keyword: POST_1.content });

    expect(posts).toEqual([POST_1]);
  });

  it('should return posts by userId', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const posts = await postsByUserIdQuery({ userId: USER.id });

    expect(posts).toEqual([POST]);
  });

  it('should return post by id', async () => {
    const POST = await createPost(ACCESS_TOKEN);

    const post = await postQuery({ id: POST.id });

    expect(post).toMatchObject(POST);
  });

  it('should update and return updated post', async () => {
    const TAG = await createTag(ACCESS_TOKEN);
    const POST = await createPost(ACCESS_TOKEN);

    const updatedPost = await postUpdateMutation<IPost>(
      {
        id: POST.id,
        input: { title: 'new_title', content: 'new_content', tagIds: [TAG.id] },
      },
      ACCESS_TOKEN,
    );

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

    const deletedPost = await postDeleteMutation<IPost>(
      {
        id: POST.id,
      },
      ACCESS_TOKEN,
    );

    expect(deletedPost).toEqual(POST);
  });
});
