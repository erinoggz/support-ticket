import { IRequest, IResponse } from '../common/Interface/IResponse';
import { AuthService } from '../service/auth.service';

class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @route POST api/v1/auth/register
   * @desc Register user
   * @access Public.
   * @returns {Promise<void>}
   */
  register = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.authService.registerUser(req.body);
      return res.ok(result, 'Registration successful');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to Register',
        error?.code
      );
    }
  };

  /**
   * @route POST api/v1/auth/login
   * @desc Login user
   * @access Public.
   * @returns {Promise<void>}
   */
  login = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.authService.loginUser(req.body);
      return res.ok(result, 'Login successful');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to Login',
        error?.code
      );
    }
  };

   /**
   * @route GET api/v1/auth/users
   * @desc Admin get all users
   * @access Public.
   * @returns {Promise<void>}
   */
  adminGetUsers = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.authService.getUsers(req);
      return res.ok(result, 'Users retrieved successfully');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to fetch users',
        error?.code
      );
    }
  };

  /**
   * @route PUT api/v1/auth/user/:id
   * @desc Admin update user
   * @access Public.
   * @returns {Promise<void>}
   */
  adminUpdateUser = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.authService.adminUpdateUser(req.body, req.params.id);
      return res.ok(result, 'User updated successfully');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to update user',
        error?.code
      );
    }
  };
}

export default AuthController;
