import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Token, TokenDocument} from '../schemas/token.schema';
import {Model} from 'mongoose';
import {JwtService} from '@nestjs/jwt';
import * as mongoose from 'mongoose';
import {TokenType} from "../types/token.type";
import {TokenExpiredError} from "jsonwebtoken";

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private readonly jwtService: JwtService,
    ) {
    }

    verifyAccessToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, {secret: `${process.env.SECRET_ACCESS}`, ignoreExpiration: false });
            if (decoded) {
                return token;
            }
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                return null;
            }
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token, {secret: `${process.env.SECRET_REFRESH}`, ignoreExpiration: false }) as TokenType;
        } catch (e) {
            return null;
        }
    }

    generateToken(payload: any) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '5m',
            secret: `${process.env.SECRET_ACCESS}`,
            algorithm: 'HS256',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '20d',
            secret: `${process.env.SECRET_REFRESH}`,
            algorithm: 'HS256',
        });

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: mongoose.Types.ObjectId, refresh_token: string ) {
        const token = await this.tokenModel.findOne({userId});
        console.log(token);
        if (token) {
            token.refresh_token = refresh_token;
            return token.save();
        }
        return await this.tokenModel.create({refresh_token, userId});
    }
}
