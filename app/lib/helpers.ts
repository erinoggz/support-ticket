import { ErrnoException } from '../common/Interface/IResponse';
import StatusCodes from './response/status-codes';

/**
 * Class with methods to help
 */
export default class Helpers {
  /**
   * Checks if an object data is empty and returns.
   * @param  {object} obj - The object to check.
   * @return {boolean} - The result.
   */
  static isEmptyObject = (obj: object): boolean => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  /**
   * Creates custom Error with status codes.
   * @param  {object} obj - The object to check.
   * @return {object} - The result.
   */
  static CustomException(code?: number, message?: string): ErrnoException {
    const error: ErrnoException = new Error(message || '');
    error.code = code || StatusCodes.UNPROCESSABLE_ENTITY;
    throw error;
  }
}
