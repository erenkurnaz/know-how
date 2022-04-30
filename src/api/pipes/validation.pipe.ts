import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@src/errors';

@Injectable()
export class ClassValidationPipe extends ValidationPipe {
  constructor() {
    super({});
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      return new ValidationException(
        this.mapFlattenValidationErrors(validationErrors),
      );
    };
  }

  protected mapFlattenValidationErrors(
    validationErrors: ValidationError[],
  ): { field: string; message: string }[] {
    return validationErrors
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flat(1)
      .filter((item) => !!item.constraints)
      .map((item) => ({
        field: item.property,
        message: Object.values(item.constraints || {}).join(''),
      }));
  }
}
