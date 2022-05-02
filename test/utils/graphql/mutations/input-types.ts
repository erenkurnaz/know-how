import { IRegisterInput } from './register-mutation';
import { ILoginInput } from './login-mutation';
import { IUpdateUserInput } from './update-user-mutation';
import { ICreatePostInput } from './create-post-mutation';
import { IUpdatePostInput } from './update-post-mutation';

interface InputTypes {
  REGISTER_MUTATION: IRegisterInput;
  LOGIN_MUTATION: ILoginInput;
  UPDATE_USER_MUTATION: IUpdateUserInput;
  CREATE_POST_MUTATION: ICreatePostInput;
  UPDATE_POST_MUTATION: IUpdatePostInput;
}

export type MutationInput<M> = M extends keyof InputTypes
  ? InputTypes[M]
  : null;
