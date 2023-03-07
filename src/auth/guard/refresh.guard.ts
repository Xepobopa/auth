import { CanActivate, HttpStatus } from "@nestjs/common";
import { TokenService } from "../../token/token.service";
import { ExecutionContext, Inject} from "@nestjs/common";
import { Request, Response } from "express"
import { Observable } from "rxjs";

export class RefreshGuard implements CanActivate {
    constructor(@Inject(TokenService) private tokenService: TokenService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        let refreshToken;
        if (request && request.cookies) {
            refreshToken = request.cookies['refreshToken'];
        }

        if (this.tokenService.verifyRefreshToken(refreshToken)){
            return true;
        }
        // TODO: cors redirect
        context.switchToHttp().getResponse().redirect('/auth/login');
    }
}
