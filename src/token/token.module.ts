import {Global, Module} from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../schemas/token.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
      secret: `${process.env.SECRET}`
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}

//@Module({
//   imports: [
//     MailModule,
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   providers: [UsersService],
//   exports: [UsersService]
// })
// export class UsersModule {}