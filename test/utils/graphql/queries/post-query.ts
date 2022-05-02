import { POST_FRAGMENT } from '../types/post-type';

export const POST_QUERY = {
  name: 'post',
  query: `
    query($id: String!) {
      post(id: $id) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
