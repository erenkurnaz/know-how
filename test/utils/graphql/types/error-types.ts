import { gql } from '../../helpers/app.helper';

interface IValidationErrorField {
  field: string;
  message: string;
}

export interface IValidationError {
  name: string;
  message: string;
  fields: IValidationErrorField[];
  status: number;
}

export interface IServerError {
  name: string;
  message: string;
  status: number;
}

export type IErrorableResult<T> = T | IValidationError | IServerError;

export const VALIDATION_ERROR_FRAGMENT = gql`
  fragment ValidationErrorFields on ValidationError {
    fields {
      field
      message
    }
    status
    name
  }
`;

export const SERVER_ERROR_FRAGMENT = gql`
  fragment ServerErrorFields on ServerError {
    name
    message
    status
  }
`;
