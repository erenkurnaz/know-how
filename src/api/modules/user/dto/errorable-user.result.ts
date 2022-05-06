import { createErrorableUnion } from '@api/utils/union-factory';
import { UserDTO } from './user.dto';

export const ErrorableUserResult = createErrorableUnion(
  'ErrorableUserResult',
  UserDTO,
);
