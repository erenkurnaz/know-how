import { Test, TestingModule } from '@nestjs/testing';

import { User, UserRepository } from '@database/user';
import { HashService } from '@security/services';
import {
  InvalidCredentialsException,
  UserExistsException,
  UserNotFoundException,
} from '../errors';
import { AuthService } from '../auth.service';
import { userRepositoryMock, hashServiceMock } from './mocks';
import { Loaded } from '@mikro-orm/core';

describe('AuthService', () => {
  const HASHED_PASSWORD = 'hashed_password';
  let USER: User;
  let module: TestingModule;
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockHashRepository: jest.Mocked<HashService>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: HashService,
          useValue: hashServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockUserRepository = module.get(UserRepository);
    mockHashRepository = module.get(HashService);

    USER = new User();
    USER.email = 'john@mail.com';
    USER.password = '123456';
    USER.fullName = 'John Doe';
  });

  afterEach(async () => {
    await module.close();
  });

  test('services should be defined', () => {
    expect(authService).toBeDefined();
    expect(mockUserRepository).toBeDefined();
    expect(mockHashRepository).toBeDefined();
  });

  describe('register', () => {
    it('should return a new user', async () => {
      mockUserRepository.checkExists.mockResolvedValue(false);
      mockHashRepository.hash.mockResolvedValue(HASHED_PASSWORD);

      const { email, fullName, password } = await authService.register({
        email: USER.email,
        fullName: USER.fullName,
        password: USER.password,
      });

      expect(email).toEqual(USER.email);
      expect(fullName).toEqual(USER.fullName);
      expect(password).toEqual(HASHED_PASSWORD);
    });

    it('should throw UserExistsException if email exists', async () => {
      mockUserRepository.checkExists.mockResolvedValue(true);

      await expect(authService.register(USER)).rejects.toBeInstanceOf(
        UserExistsException,
      );
    });
  });

  describe('login', () => {
    it('should return found user', async () => {
      mockUserRepository.findOne.mockResolvedValue(
        USER as Loaded<User, string>,
      );
      mockHashRepository.verify.mockResolvedValue(true);

      const { email, fullName, password } = await authService.login({
        email: USER.email,
        password: USER.password,
      });

      expect(email).toEqual(USER.email);
      expect(fullName).toEqual(USER.fullName);
      expect(password).toEqual(expect.any(String));
    });

    it('should throw UserNotFoundException if email is wrong', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        authService.login({
          email: USER.email,
          password: USER.password,
        }),
      ).rejects.toBeInstanceOf(UserNotFoundException);
    });

    it('should throw InvalidCredentialsException if password is wrong', async () => {
      mockUserRepository.findOne.mockResolvedValue(
        USER as Loaded<User, string>,
      );
      mockHashRepository.verify.mockResolvedValue(false);

      await expect(
        authService.login({
          email: USER.email,
          password: USER.password,
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsException);
    });
  });
});
