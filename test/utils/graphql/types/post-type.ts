import { IUser, USER_FRAGMENT } from './user-type';

export interface IPost {
  id: string;
  title: string;
  content: string;
  owner: IUser;
  createdAt: string;
  updatedAt: string;
}

export const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    content
    owner {
      ...UserFields
    }
    createdAt
    updatedAt
  }
  ${USER_FRAGMENT}
`;
