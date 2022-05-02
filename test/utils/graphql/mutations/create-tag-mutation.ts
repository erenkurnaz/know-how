import { TAG_FRAGMENT } from '../types/tag-type';

export const CREATE_TAG_MUTATION = {
  name: 'createTag',
  query: `
    mutation($name: String!) {
      createTag(name: $name) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type ICreateTagInput = { name: string };
