import { TAG_FRAGMENT } from '../types/tag-type';
import { gql } from '../../helpers/app.helper';

export const CREATE_TAG_MUTATION = {
  name: 'createTag',
  query: gql`
    mutation ($name: String!) {
      createTag(name: $name) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type ICreateTagInput = { name: string };
