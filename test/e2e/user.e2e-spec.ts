import { HttpStatus } from '@nestjs/common';
import { clearDatabase } from '../utils/helpers/app.helper';

import { createUserMock } from '../utils/helpers/user.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';
import {
  IServerError,
  IUser,
  IValidationError,
} from '../utils/graphql/object-types';
import {
  userFollowMutation,
  userUnfollowMutation,
  userUpdateMutation,
} from '../utils/graphql/mutations';
import { currentUserQuery } from '../utils/graphql/queries';

describe('User operations', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when request profile', () => {
    it('should return authorized user', async () => {
      const authResult = await authorizeUser(USER);

      const currentUser = await currentUserQuery(authResult.accessToken);

      expect(currentUser).toMatchObject(authResult.user);
    });
  });

  describe('when update user', () => {
    it('should return updated user', async () => {
      const authResult = await authorizeUser(USER);
      const updatedUser: IUser = {
        ...authResult.user,
        email: 'new@mail.com',
        fullName: 'new fullName',
        github: 'new github',
        linkedin: 'new linkedin',
        twitter: 'new twitter',
        instagram: 'new instagram',
      };

      const user = await userUpdateMutation<IUser>(
        {
          input: {
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            github: updatedUser.github,
            linkedin: updatedUser.linkedin,
            twitter: updatedUser.twitter,
            instagram: updatedUser.instagram,
          },
        },
        authResult.accessToken,
      );

      expect(user).toEqual({
        ...updatedUser,
        updatedAt: expect.any(String),
      });
    });

    it('should fail with invalid email', async () => {
      const authResult = await authorizeUser(USER);
      const updatedUser: IUser = {
        ...authResult.user,
        email: 'invalid_email',
      };

      const error = await userUpdateMutation<IValidationError>(
        {
          input: {
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            github: updatedUser.github,
            linkedin: updatedUser.linkedin,
            twitter: updatedUser.twitter,
            instagram: updatedUser.instagram,
          },
        },
        authResult.accessToken,
      );

      expect(error.name).toEqual('ValidationException');
      expect(error.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(error.fields.length).toEqual(1);
      expect(error.fields[0]).toEqual({
        field: 'email',
        message: expect.any(String),
      });
    });
  });

  describe('when follow user', () => {
    it('should return followed user if not following', async () => {
      const { user: USER_TO_FOLLOW } = await authorizeUser(createUserMock());
      const { accessToken } = await authorizeUser(USER);

      const FOLLOWED_USER = await userFollowMutation<IUser>(
        {
          userId: USER_TO_FOLLOW.id,
        },
        accessToken,
      );

      expect(FOLLOWED_USER.id).toEqual(USER_TO_FOLLOW.id);
      expect(FOLLOWED_USER.email).toEqual(USER_TO_FOLLOW.email);
      expect(FOLLOWED_USER.isFollowing).toEqual(true);
    });

    //TODO: refactor error handling
    /*it('should fail if self following', async () => {
      const { user, accessToken } = await authorizeUser(USER);

      const error = await userFollowMutation<IServerError>(
        { userId: user.id },
        accessToken,
      );

      expect(error?.message).toContain('Bad Request');
      expect(error?.status).toEqual('500');
    });*/
  });

  describe('when unfollow user', () => {
    it('should return unfollowed user if followed', async () => {
      const { user: FOLLOWED_USER } = await authorizeUser(createUserMock());
      const { accessToken } = await authorizeUser(USER);
      await userFollowMutation({ userId: FOLLOWED_USER.id }, accessToken);

      const UNFOLLOWED_USER = await userUnfollowMutation<IUser>(
        {
          userId: FOLLOWED_USER.id,
        },
        accessToken,
      );

      expect(UNFOLLOWED_USER.id).toEqual(FOLLOWED_USER.id);
      expect(UNFOLLOWED_USER.email).toEqual(FOLLOWED_USER.email);
      expect(UNFOLLOWED_USER.isFollowing).toEqual(false);
    });
  });
});
