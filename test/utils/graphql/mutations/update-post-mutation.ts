import { IPostInput, POST_FRAGMENT } from '../types/post-type';

export const UPDATE_POST_MUTATION = {
  name: 'updatePost',
  query: `
    mutation($id: String!, $input: PostInput!) {
      updatePost(id: $id, input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export interface IUpdatePostInput {
  id: string;
  input: IPostInput;
}
