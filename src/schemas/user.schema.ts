import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ default: 'ismartsdn4477@gmail.com', type: String })
  email: string;

  @Prop({ type: String })
  activationLink: string;

  @Prop({ default: false, type: Boolean })
  isActivated: boolean;

  @Prop({ required: true, type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
