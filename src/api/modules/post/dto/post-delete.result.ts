import { createErrorableUnion } from '@api/utils/union-factory';
import { PostDTO } from './post.dto';

export const PostDeleteResult = createErrorableUnion<PostDTO>(
  'PostDeleteResult',
  PostDTO,
);
