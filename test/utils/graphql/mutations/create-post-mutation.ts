import { IPostInput, POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const CREATE_POST_MUTATION = {
  name: 'createPost',
  query: gql`
    mutation ($input: PostInput!) {
      createPost(input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

export type ICreatePostInput = { input: IPostInput };
