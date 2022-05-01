import { HttpStatus } from '@nestjs/common';
import { clearDatabase } from '../app';

import {
  IAuthResult,
  IUser,
  IServerError,
  IValidationError,
} from '../graphql/types';
import { IRegisterInput } from '../graphql/mutations';
import { loginMutation, registerMutation } from '../helpers/auth.helper';
import { createUserMock } from '../helpers/user.helper';

describe('User authentication', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when user register', () => {
    it('should register successfully', async () => {
      const response = await registerMutation({
        email: USER.email,
        password: USER.password,
        fullName: USER.fullName,
      });
      const authResult = response.data as IAuthResult;

      authResultExpects(authResult, USER);
    });

    it('should fail with email used by another user', async () => {
      await registerMutation(USER);
      const user = createUserMock({
        email: USER.email,
      });

      const response = await registerMutation({
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });
      const validationError = response.data as IServerError;

      expect(validationError).toEqual({
        name: 'UserExistsException',
        message: expect.any(String),
        status: HttpStatus.CONFLICT,
      });
    });

    it('should fail with invalid email', async () => {
      const user = createUserMock({ email: 'invalid_email' });

      const response = await registerMutation(user);
      const validationError = response.data as IValidationError;

      validationErrorExpects(validationError, 'email');
    });

    it('should fail with invalid password', async () => {
      const user = createUserMock({ password: 'inv_pwd' });

      const response = await registerMutation(user);
      const validationError = response.data as IValidationError;

      validationErrorExpects(validationError, 'password');
    });
  });

  describe('when user login', () => {
    it('should login successfully', async () => {
      await registerMutation(USER);

      const response = await loginMutation({
        email: USER.email,
        password: USER.password,
      });
      const authResult = response.data as IAuthResult;

      authResultExpects(authResult, USER);
    });

    it('should fail with incorrect email', async () => {
      await registerMutation(USER);

      const response = await loginMutation({
        email: 'incorrect@email.com',
        password: USER.password,
      });
      const credentialError = response.data as IServerError;

      expect(credentialError).toEqual({
        name: 'UserNotFoundException',
        message: expect.any(String),
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should fail with incorrect password', async () => {
      await registerMutation(USER);

      const response = await loginMutation({
        email: USER.email,
        password: 'inv_pwd',
      });
      const credentialError = response.data as IServerError;

      expect(credentialError).toEqual({
        name: 'InvalidCredentialsException',
        message: expect.any(String),
        status: HttpStatus.FORBIDDEN,
      });
    });
  });
});

const validationErrorExpects = (
  error: IValidationError,
  field: keyof IRegisterInput,
) => {
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
