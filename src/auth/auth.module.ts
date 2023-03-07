import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TokenModule } from '../token/token.module';
import {AuthController} from "./auth.controller";
dotenv.config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TokenModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '5m' },
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {
}