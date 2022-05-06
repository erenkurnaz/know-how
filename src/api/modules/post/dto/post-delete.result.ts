import { createErrorableUnion } from '@api/utils/union-factory';
import { Post } from '@database/post';

export const PostDeleteResult = createErrorableUnion<Post>(
  'PostDeleteResult',
  Post,
);
