import { UserType } from '../common/Enum/userType';
import { IRequest, IResponse } from '../common/Interface/IResponse';
import ResponseMessages from '../lib/response/response-messages';
import StatusCodes from '../lib/response/status-codes';

// middleware to give access to AGENTS
export default (req: IRequest, res: IResponse, next: () => void) => {
  if (req.user.userType !== UserType.AGENT) return res.serverError(null, ResponseMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
  next();
};
