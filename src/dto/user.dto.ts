import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import {User, UserDocument} from "../schemas/user.schema";
import * as mongoose from "mongoose";

export class UserDto {
  @IsString()
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  @MinLength(5, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value1 ',
  })
  password: string;

  @IsEmail({}, { message: 'Email is wrong' })
  email: string;

  @IsString()
  username: string;

  isActivated: boolean;

  userId: mongoose.Types.ObjectId;

  tokenId: string;

  // id: mongoose.Types.ObjectId;
  // // isActivated: boolean;
  // // activatedLink: string;
  //
  constructor(userData: UserDocument) {
    this.password = userData.password;
    this.username = userData.username;
    this.userId = userData._id;
    this.email = userData.email;
    this.isActivated = userData.isActivated;

  }
}
