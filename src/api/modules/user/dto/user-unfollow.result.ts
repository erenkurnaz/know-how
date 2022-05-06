import { createErrorableUnion } from '@api/utils/union-factory';
import { User } from '@database/user';

export const UserUnfollowResult = createErrorableUnion(
  'UserUnfollowResult',
  User,
);
