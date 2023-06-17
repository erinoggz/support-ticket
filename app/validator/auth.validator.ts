import { checkSchema } from 'express-validator';
import validate from '../lib/validate';

/**
 * Validator class used for validating request data
 */
class AuthValidator {
  register = validate(
    checkSchema({
      userName: {
        in: ['body'],
        isString: {
          errorMessage: 'userName must be a string',
        },
        isLength: {
          options: {
            min: 2,
          },
          errorMessage: 'userName must have minimum of two characters',
        },
        trim: true,
      },
      email: {
        in: ['body'],
        isEmail: {
          errorMessage: 'Input a valid email',
        },
        trim: true,
      },
      password: {
        in: ['body'],
        isString: {
          errorMessage: 'Password must be a string',
        },
        isLength: {
          options: {
            min: 6,
          },
          errorMessage: 'Password must have minimum of six(6) characters',
        },
      },
    })
  );

  login = validate(
    checkSchema({
      email: {
        in: ['body'],
        isString: {
          errorMessage: 'Email must be a string',
        },
        isEmail: {
          errorMessage: 'Email is not valid',
        },
        trim: true,
      },
      password: {
        in: ['body'],
        trim: true,
        isString: {
          errorMessage: 'Password must be a string',
        },
      },
    })
  );

  updateUser = validate(
    checkSchema({
      id: {
        in: ['params'],
        trim: true,
        isMongoId: {
          errorMessage: 'Please put valid user ID',
        },
      },
    })
  );
}

export default AuthValidator;
