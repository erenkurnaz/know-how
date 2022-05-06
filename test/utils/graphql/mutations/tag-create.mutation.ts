import {
  IServerError,
  ITag,
  IValidationError,
  TAG_FRAGMENT,
} from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const TAG_CREATE_MUTATION = {
  name: 'tagCreate',
  query: gql`
    mutation ($name: String!) {
      tagCreate(name: $name) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

type ITagCreateInput = { name: string };

type ITagCreateResult = ITag | IServerError | IValidationError;

export const tagCreateMutation = async <
  T extends ITagCreateResult = ITagCreateResult,
>(
  variables: ITagCreateInput,
  token: string,
): Promise<T> => {
  const response = await new GqlClient<T>(TAG_CREATE_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
