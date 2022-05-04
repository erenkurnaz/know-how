import { HttpStatus } from '@nestjs/common';
import { clearDatabase } from '../utils/helpers/app.helper';

import {
  IAuthResult,
  IUser,
  IServerError,
  IValidationError,
  GqlBuilder,
} from '../utils/graphql';
import { authorizeUser } from '../utils/helpers/auth.helper';
import { createUserMock } from '../utils/helpers/user.helper';

describe('User authentication', () => {
  let USER: IUser;

  beforeEach(async () => {
    await clearDatabase();
    USER = createUserMock();
  });

  describe('when user register', () => {
    it('should register successfully', async () => {
      const response = await new GqlBuilder()
        .setMutation('REGISTER_MUTATION', {
          input: {
            email: USER.email,
            password: USER.password,
            fullName: USER.fullName,
          },
        })
        .execute();

      const authResult = response.data as IAuthResult;

      authResultExpects(authResult, USER);
    });

    it('should fail with email used by another user', async () => {
      await authorizeUser(USER);
      const user = createUserMock({
        email: USER.email,
      });

      const response = await new GqlBuilder()
        .setMutation('REGISTER_MUTATION', {
          input: {
            email: user.email,
            password: user.password,
            fullName: user.fullName,
          },
        })
        .execute();
      const validationError = response.data as IServerError;

      expect(validationError).toEqual({
        name: 'UserExistsException',
        message: expect.any(String),
        status: HttpStatus.CONFLICT,
      });
    });

    it('should fail with invalid email', async () => {
      const user = createUserMock({ email: 'invalid_email' });

      const response = await new GqlBuilder()
        .setMutation('REGISTER_MUTATION', {
          input: {
            email: user.email,
            password: user.password,
            fullName: user.fullName,
          },
        })
        .execute();
      const validationError = response.data as IValidationError;

      validationErrorExpects(validationError, 'email');
    });

    it('should fail with invalid password', async () => {
      const user = createUserMock({ password: 'inv_pwd' });

      const response = await new GqlBuilder()
        .setMutation('REGISTER_MUTATION', {
          input: {
            email: user.email,
            password: user.password,
            fullName: user.fullName,
          },
        })
        .execute();
      const validationError = response.data as IValidationError;

      validationErrorExpects(validationError, 'password');
    });
  });

  describe('when user login', () => {
    it('should login successfully', async () => {
      await authorizeUser(USER);

      const response = await new GqlBuilder()
        .setMutation('LOGIN_MUTATION', {
          input: {
            email: USER.email,
            password: USER.password,
          },
        })
        .execute();
      const authResult = response.data as IAuthResult;

      authResultExpects(authResult, USER);
    });

    it('should fail with incorrect email', async () => {
      await authorizeUser(USER);

      const response = await new GqlBuilder()
        .setMutation('LOGIN_MUTATION', {
          input: {
            email: 'incorrect@mail.com',
            password: USER.password,
          },
        })
        .execute();
      const credentialError = response.data as IServerError;

      expect(credentialError).toEqual({
        name: 'UserNotFoundException',
        message: expect.any(String),
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should fail with incorrect password', async () => {
      await authorizeUser(USER);

      const response = await new GqlBuilder()
        .setMutation('LOGIN_MUTATION', {
          input: {
            email: USER.email,
            password: 'inv_pwd',
          },
        })
        .execute();
      const credentialError = response.data as IServerError;

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
