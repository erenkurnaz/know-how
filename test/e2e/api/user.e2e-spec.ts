import {
  createUserMock,
  currentUserQuery,
  IUser,
} from '../helpers/user.helper';
import { clearDatabase } from '../app';
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

    it('should fail if user unauthorized', async () => {
      const { errors, data } = await currentUserQuery();

      expect(data).toEqual(null);
      expect(errors?.message).toEqual('Unauthorized');
    });
  });
});
