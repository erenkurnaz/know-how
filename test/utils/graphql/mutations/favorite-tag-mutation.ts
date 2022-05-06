import { TAG_FRAGMENT } from '../object-types';
import { gql } from '../graphql.helper';

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
