import { createErrorableUnion } from '@api/utils/union-factory';
import { User } from '@database/user';

export const UserFollowResult = createErrorableUnion('UserFollowResult', User);
