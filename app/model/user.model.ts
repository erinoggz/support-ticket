import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';
import configuration from '../config/config';
import { IUser } from './interface/IUser';

// Create the model schema & register your custom methods here
export interface IUserModel extends IUser {
  comparePassword(password: string): Promise<boolean>;
  generateJWT(): string;
}

// Create the user schema
const UserSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN', 'AGENT'],
      default: 'CUSTOMER',
    },
    userName: String,
  },
  {
    timestamps: true,
  }
);

/**
 * Hash user's password before user it is created.
 */
UserSchema.pre<IUserModel>('save', async function (_next) {
  if (!this.isModified('password')) return _next();
  try {
    this.password = await argon2.hash(this.password);
    return _next();
  } catch (_err) {
    if (_err) return _next(_err);
  }
});

/**
 * Compares the user's password with the request password.
 * @param  {string} password The user password.
 * @return {boolean} If password is correct returns true, else false.
 */
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return argon2.verify(this.password, password);
};

/**
 * Generates JWT token for user.
 * @return {string} The generated user JWT.
 */
UserSchema.methods.generateJWT = function (): string {
  const payload = {
    id: this._id,
    email: this.email,
    userType: this.userType,
  };

  return jwt.sign(payload, configuration.web.jwt_secret, {
    expiresIn: configuration.web.jwt_duration,
  });
};

// Create and export user model
const User = model<IUserModel>('Users', UserSchema);

export default User;
