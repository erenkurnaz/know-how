import { createErrorableUnion } from '@api/utils/union-factory';
import { PostDTO } from './post.dto';

export const PostUpdateResult = createErrorableUnion<PostDTO>(
  'PostUpdateResult',
  PostDTO,
);
