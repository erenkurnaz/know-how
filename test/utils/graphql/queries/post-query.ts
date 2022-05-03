import { POST_FRAGMENT } from '../types/post-type';
import { gql } from '../../helpers/app.helper';

export const POST_QUERY = {
  name: 'post',
  query: gql`
    query ($id: String!) {
      post(id: $id) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};
