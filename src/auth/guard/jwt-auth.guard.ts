import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {TokenExpiredError} from "jsonwebtoken";
import {TokenService} from "../../token/token.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context: ExecutionContext, status) {
        console.log({ err, user, info, context, status })
        if (info instanceof TokenExpiredError) {
            // TODO: cors redirect
            context.switchToHttp().getResponse().redirect('http://localhost:5000/refresh');
        }
        return user;
    }
}