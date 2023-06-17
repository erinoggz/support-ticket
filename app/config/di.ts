import di from './service-locator';

/**
 * Our Dependency Injection: All Services and Controllers will be registered here
 * This will enable us to instatiate only once and use accross all our application
 */
import { LoggerService } from '../service/logger.service';
import { TicketService } from '../service/ticket.service';
import { AuthService } from '../service/auth.service';
import AuthController from '../controller/auth.controller';
import AuthValidator from '../validator/auth.validator';
import TicketController from '../controller/ticket.controller';
import TicketValidator from '../validator/ticket.validator';

/**
 * Register Logger Service
 * Returns an instance of Logger Service
 */
di.register('logger', () => {
  return new LoggerService();
});

/**
 * Register Auth Service
 * Returns an instance of Auth Service
 */
di.register('authService', () => {
  return new AuthService();
});

/**
 * Register Auth Validator
 * Returns an instance of Auth Validator
 */
di.register('authValidator', () => {
  return new AuthValidator();
});

/**
 * Register Ticket Validator
 * Returns an instance of Ticket Validator
 */
di.register('ticketValidator', () => {
  return new TicketValidator();
});

/**
 * Register Auth Controller
 * Returns an instance of Auth Controller
 * Auth Service instance passed Auth Controller as argument
 */

di.register('authController', () => {
  const authService = di.get('authService');
  return new AuthController(authService);
});

/**
 * Register Ticket Service
 * Returns an instance of Ticket Service
 */
di.register('ticketService', () => {
  return new TicketService();
});

/**
 * Register Ticket Controller
 * Returns an instance of Ticket Controller
 * Ticket Service instance passed Ticket Controller as argument
 */

di.register('ticketController', () => {
  const ticketService = di.get('ticketService');
  return new TicketController(ticketService);
});

export default di;
