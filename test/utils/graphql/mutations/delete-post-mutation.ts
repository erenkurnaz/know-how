import { POST_FRAGMENT } from '../types/post-type';

export const DELETE_POST_MUTATION = {
  name: 'deletePost',
  query: `
  mutation($id: String!) {
    deletePost(id: $id) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`,
};

export interface IDeletePostInput {
  id: string;
}
