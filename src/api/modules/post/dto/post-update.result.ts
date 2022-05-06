import { createErrorableUnion } from '@api/utils/union-factory';
import { Post } from '@database/post';

export const PostUpdateResult = createErrorableUnion<Post>(
  'PostUpdateResult',
  Post,
);
