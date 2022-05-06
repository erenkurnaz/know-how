import { ITag, TAG_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const CREATE_TAG_MUTATION = {
  name: 'createTag',
  query: gql`
    mutation ($name: String!) {
      createTag(name: $name) {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export type ICreateTagInput = { name: string };

export const tagCreateMutation = async (
  variables: ICreateTagInput,
  token: string,
): Promise<ITag> => {
  const response = await new GqlClient<ITag>(CREATE_TAG_MUTATION, variables)
    .withAuthentication(token)
    .execute();
  return response.data;
};
