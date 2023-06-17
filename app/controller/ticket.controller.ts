import { IRequest, IResponse } from '../common/Interface/IResponse';
import { TicketService } from '../service/ticket.service';

class TicketController {
  constructor(private ticketService: TicketService) {}

  /**
   * @route POST api/v1/ticket
   * @desc create ticket
   * @access Public.
   * @returns {Promise<void>}
   */
  createTicket = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.ticketService.createTicket(req.user.id, req.body);
      return res.ok(result, 'Ticket created successful');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to create ticket',
        error?.code
      );
    }
  };

  /**
   * @route PUT api/v1/ticket/process
   * @desc create ticket
   * @access Public.
   * @returns {Promise<void>}
   */
  processTicket = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.ticketService.processTicket(
        req.user,
        req.body
      );
      return res.ok(result, 'Ticket updated successfully');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to process ticket',
        error?.code
      );
    }
  };

  /**
   * @route GET api/v1/ticket
   * @desc get ticket(s)
   * @access Public.
   * @returns {Promise<void>}
   */
  customerTickets = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.ticketService.customerTickets(
        req,
      );
      return res.ok(result, 'Ticket fetched successfully');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to fetch ticket',
        error?.code
      );
    }
  };

  /**
   * @route GET api/v1/ticket/generate/admin
   * @desc generate tickets in last month
   * @access Public.
   * @returns {Promise<void>}
   */
  generateRequestReports = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.ticketService.generateRequestReports(req, res);
      return result
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to generate ticket',
        error?.code
      );
    }
  };

  /**
   * @route GET api/v1/ticket/generate/admin
   * @desc get all tickets
   * @access Public.
   * @returns {Promise<void>}
   */
  getAllTickets = async (req: IRequest, res: IResponse): Promise<void> => {
    try {
      const result = await this.ticketService.tickets(req);
      return res.ok(result, 'Ticket fetched successfully');
    } catch (error) {
      return res.serverError(
        error,
        error?.message || 'An error occured while trying to retrieve tickets',
        error?.code
      );
    }
  };
}

export default TicketController;
