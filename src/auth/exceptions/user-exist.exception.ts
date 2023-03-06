import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistException extends HttpException {
  constructor(description?: string) {
    super('User exist in database!', HttpStatus.BAD_REQUEST, {description});
  }
}