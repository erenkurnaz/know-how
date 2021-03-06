import {
  IServerError,
  ITag,
  SERVER_ERROR_FRAGMENT,
  TAG_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const UNFAVORITE_TAG_MUTATION = {
  name: 'tagUnfavorite',
  query: gql`
    mutation ($id: String!) {
      tagUnfavorite(id: $id) {
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

type ITagUnfavoriteInput = { id: string };

type ITagUnfavoriteResult = ITag | IServerError;

export const tagUnfavoriteMutation = async <
  T extends ITagUnfavoriteResult = ITagUnfavoriteResult,
>(
  variables: ITagUnfavoriteInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(UNFAVORITE_TAG_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
