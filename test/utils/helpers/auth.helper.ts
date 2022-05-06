import { IAuthResult, IUser } from '../graphql/object-types';
import { signUpMutation, signInMutation } from '../graphql/mutations';

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await signUpMutation({
    input: {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
    },
  });

  const response = await signInMutation({
    input: { email: user.email, password: user.password },
  });

  return response as IAuthResult;
};
