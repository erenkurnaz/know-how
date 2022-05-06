import { HttpStatus } from '@nestjs/common';
import {
  IServerError,
  IUser,
  IValidationError,
} from 'test/utils/graphql/object-types';
import { clearDatabase } from '../utils/helpers/app.helper';

import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';
import { registerMutation } from '../utils/graphql/mutations/register-mutation';
import { IAuthResult } from '../utils/graphql/types';
import { loginMutation } from '../utils/graphql/mutations/login-mutation';

describe('User authentication', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when user register', () => {
    it('should register successfully', async () => {
      const authResult = await registerMutation<IAuthResult>({
        input: {
          email: USER.email,
          password: USER.password,
          fullName: USER.fullName,
        },
      });

      authResultExpects(authResult, USER);
    });

    it('should fail with email used by another user', async () => {
      await authorizeUser(USER);
      const user = createUserMock({
        email: USER.email,
      });

      const errorResponse = await registerMutation<IServerError>({
        input: {
          email: user.email,
          password: user.password,
          fullName: user.fullName,
        },
      });

      expect(errorResponse).toEqual({
        name: 'UserExistsException',
        message: expect.any(String),
        status: HttpStatus.CONFLICT,
      });
    });

    it('should fail with invalid email', async () => {
      const user = createUserMock({ email: 'invalid_email' });

      const validationError = await registerMutation<IValidationError>({
        input: {
          email: user.email,
          password: user.password,
          fullName: user.fullName,
        },
      });

      validationErrorExpects(validationError, 'email');
    });

    it('should fail with invalid password', async () => {
      const user = createUserMock({ password: 'inv_pwd' });

      const validationError = await registerMutation<IValidationError>({
        input: {
          email: user.email,
          password: user.password,
          fullName: user.fullName,
        },
      });

      validationErrorExpects(validationError, 'password');
    });
  });

  describe('when user login', () => {
    it('should login successfully', async () => {
      await authorizeUser(USER);

      const authResult = await loginMutation<IAuthResult>({
        input: {
          email: USER.email,
          password: USER.password,
        },
      });

      authResultExpects(authResult, USER);
    });

    it('should fail with incorrect email', async () => {
      await authorizeUser(USER);

      const credentialError = await loginMutation<IServerError>({
        input: {
          email: 'incorrect@mail.com',
          password: USER.password,
        },
      });

      expect(credentialError).toEqual({
        name: 'UserNotFoundException',
        message: expect.any(String),
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should fail with incorrect password', async () => {
      await authorizeUser(USER);

      const credentialError = await loginMutation<IServerError>({
        input: {
          email: USER.email,
          password: 'inv_pwd',
        },
      });

      expect(credentialError).toEqual({
        name: 'InvalidCredentialsException',
        message: expect.any(String),
        status: HttpStatus.FORBIDDEN,
      });
    });
  });
});

const validationErrorExpects = (error: IValidationError, field: string) => {
  expect(error.name).toEqual('ValidationException');
  expect(error.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);

  expect(error.fields.length).toEqual(1);
  expect(error.fields[0]).toEqual({
    field: field,
    message: expect.any(String),
  });
};

const authResultExpects = (authResult: IAuthResult, user: IUser) => {
  expect(authResult.user).toEqual({
    id: expect.any(String),
    email: user.email,
    fullName: user.fullName,
    isFollowing: null,
    github: null,
    linkedin: null,
    twitter: null,
    instagram: null,
    createdAt: expect.any(String),
    updatedAt: null,
  });

  expect(authResult.refreshToken).toEqual(expect.any(String));
  expect(authResult.accessToken).toEqual(expect.any(String));
};
