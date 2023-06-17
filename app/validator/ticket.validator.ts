import { checkSchema } from 'express-validator';
import validate from '../lib/validate';

/**
 * Validator class used for validating request data
 */
class TicketValidator {
  createTicket = validate(
    checkSchema({
      issue: {
        in: ['body'],
        isString: {
          errorMessage: 'issue must be a string',
        },
        trim: true,
      },
    })
  );
}

export default TicketValidator;
