import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {AppController} from './app.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guard/jwt-auth.guard";
import {TokenService} from "./token/token.service";
import {TokenModule} from "./token/token.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        TokenModule,
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.DB_CONNECTION_STRING,
            }),
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
