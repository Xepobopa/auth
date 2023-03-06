import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Token, TokenDocument} from '../schemas/token.schema';
import {Model} from 'mongoose';
import {User, UserDocument} from '../schemas/user.schema';
import {JwtService} from '@nestjs/jwt';
import * as mongoose from 'mongoose';

export type TokenType = {
    username: string,
    email: string,
    password: string,
    isActivated: string,
    userId: string;
    iat: number;
    exp: number
}

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private readonly jwtService: JwtService,
    ) {
    }

    getTestString() {
        return 'test';
    }

    async findToken(refreshToken) {
        return this.tokenModel.findOne({ refresh_token: refreshToken });
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            return await this.jwtService.verify(refreshToken, { secret: `${process.env.SECRET}`, ignoreExpiration: false });
        } catch (e) {

        }
    }

    async verifyRefreshTokenByToken(refreshToken: string) {
        try {
            const token = await this.tokenModel.findOne({refresh_token: refreshToken});
            await this.jwtService.verify(token.refresh_token, {
                secret: `${process.env.SECRET}`,
                ignoreExpiration: false
            });
            return this.jwtService.decode(refreshToken) as TokenType;
        }
        catch (e) {
            return null;
        }
    }

    generateToken(payload: any) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '5m',
            secret: `${process.env.SECRET}`,
            algorithm: 'HS256',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '20d',
            secret: `${process.env.SECRET}`,
            algorithm: 'HS256',
        });

        return {accessToken, refreshToken};
    }

    async decodeVerifyToken(token: string) {
        try {
            await this.jwtService.verify(token, { secret: `${process.env.SECRET}`, ignoreExpiration: false })
        }
        catch (e) { return null; }
        return this.jwtService.decode(token) as TokenType;
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
