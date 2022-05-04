import { HttpStatus } from '@nestjs/common';
import { clearDatabase } from '../utils/helpers/app.helper';

import { IUser, IValidationError, GqlBuilder } from '../utils/graphql';
import { createUserMock } from '../utils/helpers/user.helper';
import { authorizeUser } from '../utils/helpers/auth.helper';

describe('User operations', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when request profile', () => {
    it('should return authorized user', async () => {
      const authResult = await authorizeUser(USER);

      const { data } = await new GqlBuilder()
        .setQuery('CURRENT_USER_QUERY', null)
        .withAuthentication(authResult.accessToken)
        .execute();

      expect(data).toMatchObject(authResult.user);
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

      const result = await new GqlBuilder()
        .setMutation('UPDATE_USER_MUTATION', {
          input: {
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            github: updatedUser.github,
            linkedin: updatedUser.linkedin,
            twitter: updatedUser.twitter,
            instagram: updatedUser.instagram,
          },
        })
        .withAuthentication(authResult.accessToken)
        .execute();
      const user = result.data as IUser;

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

      const result = await new GqlBuilder()
        .setMutation('UPDATE_USER_MUTATION', {
          input: {
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            github: updatedUser.github,
            linkedin: updatedUser.linkedin,
            twitter: updatedUser.twitter,
            instagram: updatedUser.instagram,
          },
        })
        .withAuthentication(authResult.accessToken)
        .execute();
      const error = result.data as IValidationError;

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

      const { data: FOLLOWED_USER } = await new GqlBuilder<IUser>()
        .setMutation('FOLLOW_USER_MUTATION', {
          userId: USER_TO_FOLLOW.id,
        })
        .withAuthentication(accessToken)
        .execute();

      expect(USER_TO_FOLLOW).toEqual(FOLLOWED_USER);
    });

    it('should fail if self following', async () => {
      const { user, accessToken } = await authorizeUser(USER);

      const { data: FOLLOWED_USER, errors } = await new GqlBuilder<IUser>()
        .setMutation('FOLLOW_USER_MUTATION', {
          userId: user.id,
        })
        .withAuthentication(accessToken)
        .execute();

      expect(FOLLOWED_USER).toEqual(null);
      expect(errors?.message).toContain('Bad Request');
      expect(errors?.extensions.code).toEqual('500');
    });
  });
});
