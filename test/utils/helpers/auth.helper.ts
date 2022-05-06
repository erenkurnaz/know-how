import { IAuthResult } from '../graphql/object-types';
import { IUser } from '../graphql/object-types';
import { registerMutation } from '../graphql/mutations/register-mutation';
import { loginMutation } from '../graphql/mutations/login-mutation';

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await registerMutation({
    input: {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
    },
  });

  const response = await loginMutation({
    input: { email: user.email, password: user.password },
  });

  return response as IAuthResult;
};
