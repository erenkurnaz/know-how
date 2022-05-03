import { IErrorableResult } from './error-types';
import { gql } from '../../helpers/app.helper';

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    fullName
    github
    linkedin
    twitter
    instagram
    createdAt
    updatedAt
  }
`;

export type IErrorableUserResult = IErrorableResult<IUser>;
