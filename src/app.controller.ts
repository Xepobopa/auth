/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
    Get,
    Body,
    Res,
    Param,
} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from './auth/auth.service';
import {JwtAuthGuard} from './auth/guard/jwt-auth.guard';
import {LocalAuthGuard} from './auth/guard/local-auth.guard';
import {RegistrationValidation} from './auth/validation/reg.validation';
import {IUser} from './interfaces/user.interface';
import {UserDto} from './dto/user.dto';

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() body: UserDto, @Res() res: Response) {
        const user = await this.authService.login(body);
        res.cookie('refreshToken', user.refreshToken, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        console.log(user.accessToken);
        res.json(user);
    }

    @Post('reg')
    @HttpCode(HttpStatus.CREATED)
    async writeUser(@Body(RegistrationValidation) body: UserDto,
        @Res() res: Response ) {
        const user = await this.authService.registration(body);

        return res.json({...user});
    }

    @Get('activate/:activationLink')
    async activate(@Param('activationLink') activationLink: string, @Res() res: Response) {
        console.log(activationLink);
        await this.authService.activate(activationLink);
        res.redirect(HttpStatus.ACCEPTED, 'http:/localhost:5000/activated');
    }

    @Get('activated')
    async activatedUser(@Res() res: Response) {
        res.send('activated');
    }

    @UseGuards(JwtAuthGuard)
    @Get('profiles')
    async getProfiles() {
        return await this.authService.getAll();
    }
}
