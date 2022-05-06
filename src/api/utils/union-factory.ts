import { createUnionType } from '@nestjs/graphql';
import { ServerError, ValidationError } from '@api/errors';
import { Exception, ValidationException } from '@src/errors';
import { Type } from '@nestjs/common';

export function createErrorableUnion<T>(name: string, type: Type<T>) {
  return createUnionType<Type<T | ValidationError | ServerError>[]>({
    name,
    types: () => [type, ValidationError, ServerError],
    resolveType: (instance) => {
      if (instance instanceof ValidationException) return ValidationError;
      if (instance instanceof Exception) return ServerError;
      if (instance) return type;

      return null;
    },
  });
}
