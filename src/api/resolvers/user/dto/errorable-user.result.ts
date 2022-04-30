import { createErrorableUnion } from '@api/utils/union-factory';
import { User } from '@entities/user';

export const ErrorableUserResult = createErrorableUnion(
  'ErrorableUserResult',
  User,
);
