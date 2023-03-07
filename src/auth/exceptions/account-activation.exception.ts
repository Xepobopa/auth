import {HttpException, HttpStatus} from "@nestjs/common";

export class AccountActivationException extends HttpException {
    constructor(description?: string) {
        super('User account is not activated', HttpStatus.BAD_REQUEST, {description});
    }
}