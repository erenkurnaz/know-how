import { IAuthResult } from '../graphql/object-types';
import { IUser } from '../graphql/object-types';
import { signUpMutation } from '../graphql/mutations/sign-up.mutation';
import { signInMutation } from '../graphql/mutations/sign-in.mutation';

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
