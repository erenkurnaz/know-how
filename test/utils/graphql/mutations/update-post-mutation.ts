import { IPostInput, POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const UPDATE_POST_MUTATION = {
  name: 'updatePost',
  query: gql`
    mutation ($id: String!, $input: PostInput!) {
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
