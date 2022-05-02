import { IAuthResult, IUser, GqlBuilder } from '../graphql';

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await new GqlBuilder()
    .setMutation('REGISTER_MUTATION', {
      input: {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      },
    })
    .execute();

  const response = await new GqlBuilder()
    .setMutation('LOGIN_MUTATION', {
      input: {
        email: user.email,
        password: user.password,
      },
    })
    .execute();

  return response.data as IAuthResult;
};
