import { IRegisterInput } from './register-mutation';
import { ILoginInput } from './login-mutation';
import { IUpdateUserInput } from './update-user-mutation';
import { ICreatePostInput } from './create-post-mutation';
import { IUpdatePostInput } from './update-post-mutation';
import { IDeletePostInput } from './delete-post-mutation';
import { ICreateTagInput } from './create-tag-mutation';
import { IFavoriteTagInput } from './favorite-tag-mutation';
import { IUnfavoriteTagInput } from './unfavorite-tag-mutation';
import { IFollowUserInput } from './follow-user-mutation';

interface InputTypes {
  REGISTER_MUTATION: IRegisterInput;
  LOGIN_MUTATION: ILoginInput;
  UPDATE_USER_MUTATION: IUpdateUserInput;
  CREATE_POST_MUTATION: ICreatePostInput;
  UPDATE_POST_MUTATION: IUpdatePostInput;
  DELETE_POST_MUTATION: IDeletePostInput;
  CREATE_TAG_MUTATION: ICreateTagInput;
  FAVORITE_TAG_MUTATION: IFavoriteTagInput;
  UNFAVORITE_TAG_MUTATION: IUnfavoriteTagInput;
  FOLLOW_USER_MUTATION: IFollowUserInput;
}

export type MutationInput<M> = M extends keyof InputTypes
  ? InputTypes[M]
  : null;
