import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { TokenService } from "../../token/token.service";
import {AccountActivationException} from "../exceptions/account-activation.exception";
import {TokenType} from "../../types/token.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${process.env.SECRET_ACCESS}`,
            ignoreExpiration: false,
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: TokenType) {
        if (!payload.isActivated) {
            throw new AccountActivationException(`${payload.username}'s is not activated`);
        }
        return payload;
    }
}