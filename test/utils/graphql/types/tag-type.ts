export interface ITag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const TAG_FRAGMENT = `
  fragment TagFields on Tag {
    id
    name
    createdAt
    updatedAt
  }
`;
