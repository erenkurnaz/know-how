import { ITag, TAG_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const UNFAVORITE_TAG_MUTATION = {
  name: 'unfavoriteTag',
  query: gql`
    mutation ($id: String!) {
      unfavoriteTag(id: $id) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type IUnfavoriteTagInput = { id: string };

export const tagUnfavoriteMutation = async (
  variables: IUnfavoriteTagInput,
  token: string,
): Promise<ITag> => {
  const response = await new GqlClient<ITag>(UNFAVORITE_TAG_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
