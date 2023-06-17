import express, { Router } from 'express';
import di from '../../config/di';
import TicketController from '../../controller/ticket.controller';
import authMiddleware from '../../middleware/auth.middleware';
import staffMiddleware from '../../middleware/staff.middleware';
import TicketValidator from '../../validator/ticket.validator';

/**
  Express Router for handling routes.
  @type {Router}
*/
const TicketRouter: Router = express.Router();
const ticketController: TicketController = di.get('ticketController');
const ticketValidator: TicketValidator = di.get('ticketValidator');

TicketRouter.post('/', ticketValidator.createTicket, authMiddleware, ticketController.createTicket)
.put('/process', authMiddleware, ticketController.processTicket)
.get('/customer', authMiddleware, ticketController.customerTickets)
.get('/generate', authMiddleware, staffMiddleware, ticketController.generateRequestReports)
.get('/staff', authMiddleware, staffMiddleware, ticketController.getAllTickets)

export default TicketRouter;
