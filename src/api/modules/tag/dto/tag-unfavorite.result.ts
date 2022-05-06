import { createErrorableUnion } from '@api/utils/union-factory';
import { Tag } from '@database/tag';

export const TagUnfavoriteResult = createErrorableUnion(
  'TagUnfavoriteResult',
  Tag,
);
