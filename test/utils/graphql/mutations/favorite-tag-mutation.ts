import { TAG_FRAGMENT } from '../types/tag-type';
import { gql } from '../../helpers/app.helper';

export const FAVORITE_TAG_MUTATION = {
  name: 'favoriteTag',
  query: gql`
    mutation ($id: String!) {
      favoriteTag(id: $id) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type IFavoriteTagInput = { id: string };
