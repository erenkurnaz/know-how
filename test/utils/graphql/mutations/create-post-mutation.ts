import { IPost, POST_FRAGMENT } from '../types/post-type';

export const CREATE_POST_MUTATION = {
  name: 'createPost',
  query: `
    mutation($input: CreatePostInput!) {
      createPost(input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export interface ICreatePostInput {
  input: Pick<IPost, 'title' | 'content'>;
}
