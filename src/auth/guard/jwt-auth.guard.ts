import {BadRequestException, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import {argsArgArrayOrObject} from "rxjs/internal/util/argsArgArrayOrObject";
import {TokenService} from "../../token/token.service";
import {UsersService} from "../../users/users.service";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // constructor(private readonly userService: UsersService, private readonly tokenService: TokenService) {
    //     super();
    // }

    // async canActivate(context: ExecutionContext): Promise<boolean> {}

    // @ts-ignore
    handleRequest(err, user, info, context: ExecutionContext, status) {
        console.log({ err, user, info, context, status });
        return super.handleRequest(err, user, info, context, status);
    }
    //
    // async refresh(refreshToken: string) {
    //     if (!refreshToken) {
    //         throw new BadRequestException('refresh token is not valid');
    //     }
    //
    //     const userData = await this.tokenService.validateRefreshToken(refreshToken);
    //     const tokenFromDb = this.tokenService.findToken(refreshToken);
    //     if (!userData && !tokenFromDb) {
    //         throw new UnauthorizedException();
    //     }
    //
    //     const user = await this.userService.findOneById(userData.userId);
    //     console.log(user.toObject({versionKey: false}));
    //     return (await this.tokenService.generateToken(user.toObject({versionKey: false}))).accessToken
    // }
}