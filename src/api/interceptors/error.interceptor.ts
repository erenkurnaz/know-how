import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Exception } from '@src/errors';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Exception> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof Exception) return of(error);

        throw new InternalServerErrorException(error.message);
      }),
    );
  }
}
