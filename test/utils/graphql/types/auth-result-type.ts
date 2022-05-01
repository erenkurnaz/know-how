import { IUser } from './user-type';
import { IErrorableResult } from './error-types';

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export type IErrorableAuthResult = IErrorableResult<IAuthResult>;
