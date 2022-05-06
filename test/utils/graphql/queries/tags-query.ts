import { ITag, TAG_FRAGMENT } from '../object-types';
import { gql, GqlClient } from '../graphql.helper';

export const TAGS_QUERY = {
  name: 'tags',
  query: gql`
    query {
      tags {
        ...TagFields
      }
    }
    ${TAG_FRAGMENT}
  `,
};

export const tagsQuery = async (): Promise<ITag[]> => {
  const result = await new GqlClient<ITag[]>(TAGS_QUERY).execute();
  return result.data;
};
