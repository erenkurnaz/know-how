import { POST_FRAGMENT } from '../types/post-type';

export const POSTS_QUERY = {
  name: 'posts',
  query: `
    query {
      posts {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
