import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  IAuthResult,
  IUser,
  GqlBuilder,
} from '../graphql';

export const authorizeUser = async (user: IUser): Promise<IAuthResult> => {
  await new GqlBuilder()
    .setQuery(REGISTER_MUTATION)
    .setVariables({
      input: {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      },
    })
    .execute();

  const response = await new GqlBuilder()
    .setQuery(LOGIN_MUTATION)
    .setVariables({
      input: {
        email: user.email,
        password: user.password,
      },
    })
    .execute();

  return response.data as IAuthResult;
};
