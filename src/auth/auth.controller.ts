import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { UserDto } from "../dto/user.dto";
import { Request, Response } from "express";
import { RegistrationValidation } from "./validation/reg.validation";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
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
    async writeUser(@Body(RegistrationValidation) body: UserDto, @Res() res: Response ) {
        const user = await this.authService.registration(body);

        return res.json({...user});
    }

    @Post('refresh')
    @HttpCode(HttpStatus.CREATED)
    async refresh(@Req() req: Request) {
        let refreshToken;
        if (req && req.cookies) {
            refreshToken = req.cookies['refreshToken'];
        }
        return await this.authService.refresh(refreshToken);
    }

    @Get('activate/:activationLink')
    async activate(@Param('activationLink') activationLink: string, @Res() res: Response) {
        console.log(activationLink);
        await this.authService.activate(activationLink);
        res.redirect(HttpStatus.ACCEPTED, 'http:/localhost:5000/activated');
    }
}