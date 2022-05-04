import { gql } from '../../helpers/app.helper';

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
