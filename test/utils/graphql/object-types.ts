import { gql } from './graphql.helper';

// OBJECT TYPES //
export interface IAuthResult {
  user: IUser;
  refreshToken: string;
  accessToken: string;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
  isFollowing: boolean | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  updatedAt: string | null;
}

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    fullName
    isFollowing
    github
    linkedin
    twitter
    instagram
    createdAt
    updatedAt
  }
`;

export interface ITag {
  id: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TAG_FRAGMENT = gql`
  fragment TagFields on Tag {
    id
    name
    isFavorite
    createdAt
    updatedAt
  }
`;

export interface IPost {
  id: string;
  title: string;
  content: string;
  owner: IUser;
  tags: ITag[];
  createdAt: string;
  updatedAt: string | null;
}

export const POST_FRAGMENT = gql`
  fragment PostFields on Post {
    id
    title
    content
    owner {
      ...UserFields
    }
    tags {
      ...TagFields
    }
    createdAt
    updatedAt
  }
  ${USER_FRAGMENT}
  ${TAG_FRAGMENT}
`;

// E: OBJECT TYPES //

// PAGINATION //
export interface IPaginationOption {
  limit: number;
  offset: number;
}

export interface IPaginatedPostResult {
  posts: IPost[];
  total: number;
}
// E: PAGINATION //

// ERRORS //
interface IValidationErrorField {
  field: string;
  message: string;
}

export interface IValidationError {
  name: string;
  message: string;
  fields: IValidationErrorField[];
  status: number;
}
export const VALIDATION_ERROR_FRAGMENT = gql`
  fragment ValidationErrorFields on ValidationError {
    fields {
      field
      message
    }
    status
    name
  }
`;

export interface IServerError {
  name: string;
  message: string;
  status: number;
}

export const SERVER_ERROR_FRAGMENT = gql`
  fragment ServerErrorFields on ServerError {
    name
    message
    status
  }
`;

// E: ERRORS //
