import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserExistException } from '../exceptions/user-exist.exception';

@Injectable()
export class RegistrationValidation implements PipeTransform {
  constructor(private usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOne(value.username);
    if (user) {
     throw new UserExistException(`Found ${value.username} in database`);
    }

    return value;
  }
}