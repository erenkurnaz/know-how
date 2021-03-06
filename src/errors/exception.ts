import { HttpStatus } from '@nestjs/common';

export interface IException {
  name: string;
  message: string;
  status: HttpStatus;
}

export class Exception implements IException {
  name: string;
  message: string;

  constructor(readonly status: HttpStatus, readonly errorMessage?: string) {
    this.name = this.constructor.name;
    this.initMessage();
    if (errorMessage) {
      this.message = errorMessage;
    }
  }

  private initMessage() {
    const match = this.constructor.name.match(/[A-Z][a-z]+/g);

    if (match) {
      this.message = match
        .map((value: string, index: number) => {
          return index === 0 ? value : value.toLocaleLowerCase();
        })
        .join(' ');
    }
  }
}
