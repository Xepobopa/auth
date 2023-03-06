import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail(to: string, link: string) {
    return await this.mailerService
      .sendMail({
        to,
        from: 'ismartsdn4477@gmail.com',
        subject: '👇 Account activation 👇',
        text: '',
        html: `<a href='https://localhost:5000/api/activate/${link}' target='_blank'>Click here to activate</a>`
      });
  }
}