import { ITag, TAG_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const FAVORITE_TAG_MUTATION = {
  name: 'favoriteTag',
  query: gql`
    mutation ($id: String!) {
      favoriteTag(id: $id) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type IFavoriteTagInput = { id: string };

export const tagFavoriteMutation = async (
  variables: IFavoriteTagInput,
  token: string,
): Promise<ITag> => {
  const response = await new GqlClient<ITag>(FAVORITE_TAG_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
