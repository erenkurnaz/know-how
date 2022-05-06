import { IServerError, IValidationError, POST_FRAGMENT } from '../object-types';
import { GqlClient, gql } from '../graphql.helper';
import { IPost } from '../object-types';

export const POST_UPDATE_MUTATION = {
  name: 'postUpdate',
  query: gql`
    mutation ($id: String!, $input: PostInput!) {
      postUpdate(id: $id, input: $input) {
        ...PostFields
      }
    }
    ${POST_FRAGMENT}
  `,
};

interface IUpdatePostInput {
  id: string;
  input: {
    title: string;
    content: string;
    tagIds: string[];
  };
}

type IPostUpdateResult = IPost | IValidationError | IServerError;

export const postUpdateMutation = async <
  T extends IPostUpdateResult = IPostUpdateResult,
>(
  variables: IUpdatePostInput,
  token: string,
): Promise<T> => {
  const result = await new GqlClient<T>(POST_UPDATE_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return result.data;
};
