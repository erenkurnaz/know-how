import { IUser, USER_FRAGMENT } from './user-type';
import { ITag, TAG_FRAGMENT } from './tag-type';
import { gql } from '../../helpers/app.helper';

export interface IPost {
  id: string;
  title: string;
  content: string;
  owner: IUser;
  tags: ITag[];
  createdAt: string;
  updatedAt: string | null;
}

export interface IPostInput extends Pick<IPost, 'title' | 'content'> {
  tagIds: string[];
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
