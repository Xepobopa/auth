import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          //ignoreTLS: true,
          secure: false,
          auth: {
            user: 'ismartsdn4477@gmail.com',
            pass: 'eqahvaczfrfgexin'
          }
        },
        defaults: {
          from: '"no-reply bot" <ismartsdn4477@gmail.com>',
        },
        template: {
          options: {
            strict: true,
          },
        },
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}