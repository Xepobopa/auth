import {BadRequestException, Injectable, Req, UnauthorizedException} from '@nestjs/common';
import {Request} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {UserDto} from "../../dto/user.dto";
import {TokenService, TokenType} from "../../token/token.service";
import {Token} from "../../schemas/token.schema";
import {UsersService} from "../../users/users.service";
import {User, UserDocument} from "../../schemas/user.schema";
import * as jwt from 'jsonwebtoken';
import {TokenExpiredError} from "jsonwebtoken";
import * as util from 'util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private tokenService: TokenService, private userService: UsersService) {
        super({
            jwtFromRequest: (req: Request): string => {
                let token = null;
                if (req && req.headers && req.headers.authorization) {
                    token = req.headers.authorization.split(" ")[1]
                }

                jwt.verify(
                    token,
                    `${process.env.SECRET}`,
                    {ignoreExpiration: false, algorithms: ['HS256']},
                    (error, decoded) => {
                        if (error instanceof TokenExpiredError) {
                            token = this.refresh(req?.cookies?.['refreshToken'])
                        }
                    }
                )
                console.log(token);
                return token;
            },
            secretOrKey: `${process.env.SECRET}`,
            ignoreExpiration: false,
            passReqToCallback: true,
        })
    }

    refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new BadRequestException('refresh token is not valid');
        }

        const token = jwt.verify(refreshToken,
            `${process.env.SECRET}`,
            {ignoreExpiration: false}) as TokenType;

        const {iat, exp, ...payload} = token;

        return this.tokenService.generateToken(payload).accessToken;
    }

    async validate(req: Request, payload: UserDto) {
        console.log('validate');
        return payload;
    }
}