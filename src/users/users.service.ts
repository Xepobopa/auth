import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from 'src/schemas/user.schema';
import {Model} from 'mongoose';
import * as uuid from 'uuid';
import {MailService} from '../mail/mail.service';
import {UserDto} from '../dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly mailService: MailService,
    ) {
    }

    async findOne(username: string) {
        return this.userModel.findOne({username});
    }

    async validateUser(username: string, pass: string) {
        const user = await this.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    async getAll() {
        return this.userModel.find();
    }

    async activate(activationLink: string) {
        const user = await this.userModel.findOne({activationLink});
        if (!user) {
            throw new BadRequestException("Can't find user by activation link");
        }

        return user;
    }

    async findOneById(id: string) {
        return this.userModel.findOne({ id: id })
    }

    async login(username: string) {
        const user = await this.findOne(username);
        await this.mailService.sendMail(user.email, user.activationLink);
        return user;
    }

    async writeUser(user: UserDto): Promise<UserDocument> {
        const activationLink = uuid.v4();
        return await this.userModel.create({
            username: user.username,
            email: user.email,
            activationLink,
            isActivated: false,
            password: await bcrypt.hash(user.password, 5),
        } as User);
    }
}
