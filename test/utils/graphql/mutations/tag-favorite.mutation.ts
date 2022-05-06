import {
  IServerError,
  ITag,
  SERVER_ERROR_FRAGMENT,
  TAG_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const TAG_FAVORITE_MUTATION = {
  name: 'tagFavorite',
  query: gql`
    mutation ($id: String!) {
      tagFavorite(id: $id) {
        ... on Tag {
          ...TagFields
        }
        ... on ServerError {
          ...ServerErrorFields
        }
      }
    }
    ${TAG_FRAGMENT}
    ${SERVER_ERROR_FRAGMENT}
  `,
};

type ITagFavoriteInput = { id: string };

type ITagFavoriteResult = ITag | IServerError;

export const tagFavoriteMutation = async <
  T extends ITagFavoriteResult = ITagFavoriteResult,
>(
  variables: ITagFavoriteInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(TAG_FAVORITE_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
