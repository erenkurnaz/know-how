import { createErrorableUnion } from '@api/utils/union-factory';
import { PostDTO } from './post.dto';

export const PostCreateResult = createErrorableUnion<PostDTO>(
  'PostCreateResult',
  PostDTO,
);
