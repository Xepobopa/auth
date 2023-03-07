import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../schemas/user.schema';
import { TokenService } from '../token/token.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
    ) {
    }

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async refresh(token: string) {
        if (!token) {
            throw new BadRequestException('refresh token is not valid');
        }

        const decoded = await this.tokenService.verifyRefreshToken(token);
        const {iat, exp, ...payload} = decoded;
        return this.tokenService.generateToken(payload).accessToken;
    }

    async activate(activationLink: string) {
        const user = await this.userService.activate(activationLink);
        user.isActivated = true;
        await user.save();
    }

    async login(userData: UserDto) {
        const user: UserDocument = await this.userService.login(userData.username);
        const tokens = this.tokenService.generateToken(user.toObject({versionKey: false}));
        await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);

        return {...tokens, user};
    }

    async registration(userData: UserDto) {
        const user: UserDocument = await this.userService.writeUser(userData);

        return {user};
    }

    async getAll() {
        return await this.userService.getAll();
    }
}
