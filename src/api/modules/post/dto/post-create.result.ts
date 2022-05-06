import { createErrorableUnion } from '@api/utils/union-factory';
import { Post } from '@database/post';

export const PostCreateResult = createErrorableUnion<Post>(
  'PostCreateResult',
  Post,
);
