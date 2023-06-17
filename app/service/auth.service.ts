import { LoginDto, RegisterDto, updateUserDto } from '../common/Dto/IAuth';
import { UserType } from '../common/Enum/userType';
import { Pagination } from '../common/Interface/IPagination';
import { ErrnoException, IRequest } from '../common/Interface/IResponse';
import Helpers from '../lib/helpers';
import StatusCodes from '../lib/response/status-codes';
import { IUser } from '../model/interface/IUser';
import User, { IUserModel } from '../model/user.model';
import PaginationService from './pagination.service';

export class AuthService {
  pagination: PaginationService<IUserModel>;

  constructor() {
    this.pagination = new PaginationService(User);
  }

  /**
   * Registers a user.
   * @param {RegisterDto} body - The registration data.
   * @returns {Promise<ErrnoException|{ token: string, user: IUser }>} Resolves to an error or an object containing the token and user data.
   */

  public registerUser = async (
    body: RegisterDto
  ): Promise<
    | ErrnoException
    | {
        token: string;
        user: IUser;
      }
  > => {
    const { email, password, userName, userType } = body;
    const isUserExist = await User.findOne({ email });

    // Validate email addresss
    if (isUserExist)
      return Helpers.CustomException(
        StatusCodes.BAD_REQUEST,
        `User with ${email} already exist!`
      );
    let user: IUserModel = new User({
      email,
      password,
      userName,
    });

    // change userType to ADMIN if admin query is passed
    if (userType && userType === 'admin') {
      user.userType = UserType.ADMIN;
    }
    // change userType to AGENT if agent query is passed
    if (userType && userType === 'agent') {
      user.userType = UserType.AGENT;
    }
    user = await user.save();
    // Make response not to send user password
    user.password = undefined;
    return {
      token: user.generateJWT(),
      user,
    };
  };

  /**
   * Logs in a user.
   * @param {LoginDto} body - The login data.
   * @returns {Promise<ErrnoException|{ token: string, user: IUser }>} Resolves to an error or an object containing the token and user data.
   */
  public loginUser = async (
    body: LoginDto
  ): Promise<
    | ErrnoException
    | {
        token: string;
        user: IUser;
      }
  > => {
    const { email, password } = body;

    const user = await User.findOne({
      email,
    });

    // Validate email addresss
    if (!user)
      return Helpers.CustomException(
        StatusCodes.NOT_FOUND,
        'User with email does not exist'
      );

    // Validate password
    if (!(await user.comparePassword(password)))
      return Helpers.CustomException(
        StatusCodes.UNAUTHORIZED,
        'Invalid Email and Password provided'
      );

    // Make response not to send user password
    user.password = undefined;
    return {
      token: user.generateJWT(),
      user,
    };
  };

  /**
   * Retrieves a list of users with pagination.
   * @returns {Promise<Pagination<unknown>>} Resolves to a paginated list of users.
   */

  public getUsers = async (req: IRequest): Promise<Pagination<unknown>> => {
    /**
     * @typedef {Object} Pagination
     * @property {number} page - The current page number.
     * @property {number} pages - The total number of pages.
     * @property {number} total - The total count of items.
     * @property {number} limit - Total limit set.
     */

    const query = { ...req.query };
    query['sort'] = { createdAt: 'desc' };
    const select = { password: 0 };
    const response = await this.pagination.paginate(query, [], select);
    return response;
  };

  /**
   * Updates a user.
   * @param {updateUserDto} body - The login data.
   * @param user - The user id.
   * @returns {Promise<IUserModel>} Resolves to an error or an object containing the user data.
   */
  public adminUpdateUser = async (
    body: updateUserDto,
    user: string
  ): Promise<void> => {
    const userData = {};
    let validateData = [];
    validateData = ['userName', 'userType'];

    // Makes only data in validateData that can be updated
    Object.entries(body).forEach(([key, value]) => {
      if (validateData.includes(key)) userData[key] = value;
    });
    await User.findByIdAndUpdate(user, { $set: userData });
  };
}
