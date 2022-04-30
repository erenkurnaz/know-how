//<--- Errors ---> //
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

export const ON_ERRORABLE_RESULT = `
  ... on ValidationError {
    fields {
      field
      message
    }
    name
    message
    status
  }
  ... on ServerError {
    name
    message
    status
  }
`;
//<--- E: Errors ---> //
