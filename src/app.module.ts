import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from "./token/token.module";

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
    providers: [],
})
export class AppModule {
}
