import { POST_FRAGMENT } from '../types/post-type';

export const CREATE_POST_MUTATION = {
  name: 'createPost',
  query: `
    mutation($input: PostInput!) {
      createPost(input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
