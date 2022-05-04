import { TAG_FRAGMENT } from '../types/tag-type';
import { gql } from '../../helpers/app.helper';

export const UNFAVORITE_TAG_MUTATION = {
  name: 'unfavoriteTag',
  query: gql`
    mutation ($id: String!) {
      unfavoriteTag(id: $id) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type IUnfavoriteTagInput = { id: string };
