import passport from 'passport';
import { Request, NextFunction } from 'express';
import { IResponse } from '../common/Interface/IResponse';
import ResponseMessages from '../lib/response/response-messages';
import StatusCodes from '../lib/response/status-codes';


/**
 * Express middleware for authenticating requests using JWT.
 * @param {Request} req - The request object.
 * @param {IResponse} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export default (req: Request, res: IResponse, next: NextFunction): void => {
  passport.authenticate('jwt', function (err, user) {
    if (err) return next(err);
    if (!user)
      return res.serverError(
        null,
        ResponseMessages.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED
      );
    user.password = undefined;
    req.user = user;
    next();
  })(req, res, next);
};
