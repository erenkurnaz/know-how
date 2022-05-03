import { POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const DELETE_POST_MUTATION = {
  name: 'deletePost',
  query: gql`
    mutation ($id: String!) {
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
