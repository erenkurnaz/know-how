import { HttpStatus } from '@nestjs/common';
import { clearDatabase } from '../app';

import {
  createUserMock,
  currentUserQuery,
  updateUserMutation,
} from '../helpers/user.helper';
import { IUser, IValidationError } from '../graphql/types';
import { authorizeUser } from '../helpers/auth.helper';

describe('User operations', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when request profile', () => {
    it('should return authorized user', async () => {
      const authResult = await authorizeUser(USER);

      const { data } = await currentUserQuery(authResult.accessToken);

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

      const result = await updateUserMutation(
        updatedUser,
        authResult.accessToken,
      );
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

      const result = await updateUserMutation(
        updatedUser,
        authResult.accessToken,
      );
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
});
