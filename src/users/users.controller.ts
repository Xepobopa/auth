import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { AuthService } from "../auth/auth.service";

@Controller('users')
export class UsersController {
    constructor(private authService: AuthService) {}

    @Get('profiles')
    @UseGuards(JwtAuthGuard)
    async getProfiles() {
        return await this.authService.getAll();
    }

    // and some other user routes
}
