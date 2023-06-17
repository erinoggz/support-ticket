import { ErrnoException, IRequest, IResponse } from '../common/Interface/IResponse';
import Helpers from '../lib/helpers';
import Ticket from '../model/ticket.model';
import { Types } from 'mongoose';
import StatusCodes from '../lib/response/status-codes';
import TicketResponse from '../model/ticket-response.model';
import { ticketType } from '../common/enum/ticketType';
import PaginationService from './pagination.service';
import { ITicket } from '../model/interface/ITicket';
import { Parser } from '@json2csv/plainjs';
import PDFDocument from 'pdfkit';
import { Pagination } from '../common/Interface/IPagination';
import { IUser } from '../model/interface/IUser';
import { UserType } from '../common/Enum/userType';
import { CreateTicketDto, ProcessTicketDto } from '../common/Dto/ITicket';

export class TicketService {
  pagination: PaginationService<ITicket>;

  constructor() {
    this.pagination = new PaginationService(Ticket);
  }

  // populate query used to populate data
  private populateQuery = [
    {
      path: 'responses',
      populate: {
        path: 'user',
        model: 'Users',
        select: '_id userName userType',
      },
      select: '_id text userType updatedAt createdAt',
    },
  ];

  /**
   * Creates a new ticket.
   * @param {Types.ObjectId} user - The user ObjectId associated with the ticket.
   * @param {Object} body - The ticket data.
   * @param {CreateTicketDto} body - The issue description for the ticket.
   * @returns {Promise<ITicket>} A promise that resolves to the created ticket.
   */
  public createTicket = async (
    user: Types.ObjectId,
    body: CreateTicketDto
  ): Promise<ITicket> => {
    /**
     * @typedef {Object} ITicket
     * @property {Types.ObjectId} user - The user ObjectId associated with the ticket.
     * @property {string} body.issue - The issue description for the ticket.
     */

    const { issue } = body;
    return Ticket.create({
      user,
      issue,
    });
  };

  /**
   * Processes a ticket by adding a comment and updating its status.
   * @param {IUser} user - The user performing the ticket processing.
   * @param {ProcessTicketDto} body - The ticket processing data.
   * @param {Types.ObjectId} body.ticket - The ticket ObjectId.
   * @param {string} body.text - The response text.
   * @param {string} [body.status] - The optional ticket status.
   *
   * @returns {Promise<ITicketResponse | ErrnoException>} A promise that resolves to the created ticket response with additional details or an error.
   */
  public processTicket = async (
    user: IUser,
    body: ProcessTicketDto
  ): Promise<void | ErrnoException> => {
    /**
     * @typedef {Object} IUser
     * @property {string} userType - The type of the user.
     */

    const { ticket, text, status } = body;
    const ticketData = await Ticket.findById(ticket);

    // Validate ticket exists
    if (!ticketData)
      return Helpers.CustomException(
        StatusCodes.BAD_REQUEST,
        `Invalid ticket ID. Ticket doesn't exist!`
      );

    // disbale customer commenting. Comment on only your processing tickets
    if (
      ticketData.status !== ticketType.PROCESSING &&
      user.userType === UserType.CUSTOMER
    )
      return Helpers.CustomException(
        StatusCodes.BAD_REQUEST,
        `Ticket is not open for commenting`
      );

    const ticketResponse = await TicketResponse.create({
      ticket: new Types.ObjectId(ticket),
      user,
      text,
    });

    // allow only agent to change ticket status to processing to enable customers comment
    // allow ability for agents or admin to close ticket
    let ticketStatus = ticketData.status;
    if (user.userType === UserType.AGENT) {
      ticketStatus = ticketType.PROCESSING;
    }
    if (status && status === 'closed' && user.userType !== UserType.CUSTOMER) {
      ticketStatus = ticketType.CLOSED;
    }

    await Ticket.updateOne(
      { _id: new Types.ObjectId(ticket) },
      { status: ticketStatus, $push: { responses: ticketResponse._id } },
      { upsert: true, new: true }
    );
  };

  /**
   * @typedef {Object} Pagination
   * @property {number} page - The current page number.
   * @property {number} pages - The total number of pages.
   * @property {number} total - The total count of items.
   * @property {number} limit - Total limit set.
   */
  public customerTickets = async (req: IRequest): Promise<Pagination<unknown>> => {
    const query = { user: new Types.ObjectId(req.user.id), ...req.query };
    query['populate'] = this.populateQuery;
    query['sort'] = { updatedAt: 'desc' };
    const response = await this.pagination.paginate(query);
    return response;
  };

  /**
   * @typedef {Object} Pagination
   * @property {number} page - The current page number.
   * @property {number} pages - The total number of pages.
   * @property {number} total - The total count of items.
   * @property {number} limit - Total limit set.
   */
  public tickets = async (req: IRequest): Promise<Pagination<unknown>> => {
    const query = { ...req.query };
    query['populate'] = this.populateQuery;
    query['sort'] = { createdAt: 'desc' };
    const response = await this.pagination.paginate(query);
    return response;
  };

  /**
   * Generates a PDF document based on the provided data.
   * @param {Array<Object>} data - The data to be included in the PDF.
   * @returns {Promise<Buffer>} A promise that resolves to the generated PDF buffer.
   */
  private generatePDF(data: Array<ITicket>): Promise<Buffer> {
    /**
     * @typedef {Object} PDFDocument
     * @property {Function} on - Adds an event listener to the PDFDocument instance.
     * @property {Function} text - Adds text to the PDFDocument instance.
     * @property {Function} end - Signals the end of the PDFDocument instance.
     * @property {Function} emit - Emits an event from the PDFDocument instance.
     */

    return new Promise((resolve, reject) => {
      const pdf = new PDFDocument();
      const buffers = [];

      pdf.on('data', (buffer) => buffers.push(buffer));
      pdf.on('end', () => resolve(Buffer.concat(buffers)));
      pdf.on('error', (error) => reject(error));

      pdf.text('Closed request reports from the last one month');

      pdf.text('\n');
      data.forEach((item) => {
        pdf.text(`_id: ${item._id}`);
        pdf.text(`status: ${item.status}`);
        pdf.text(`issue: ${item.issue}`);
        pdf.text('----------------------');
      });

      pdf.end();
    });
  }

  /**
 * Generates request reports based on the provided format and sends the response.
 * Request Format can be either csv or pdf
 * Set headers for appropriate file type
 * @param {IRequest} req - The request object.
 * @param {IResponse} res - The response object.
 * @returns {Promise<void>}
 */
  public generateRequestReports = async (req: IRequest, res: IResponse): Promise<void> => {
    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() - 1);

    const tickets = await Ticket.find({
      status: ticketType.CLOSED,
      createdAt: { $lt: new Date() },
    }).populate('responses');

    if (req.query.requestFormat === 'csv') {
      const fields = ['_id', 'status', 'issue'];

      const parser = new Parser({ fields });
      const csv = parser.parse(tickets);
      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

      // Send the CSV data as the response
      res.status(200).send(csv);
    } else if (req.query.requestFormat === 'pdf') {
      // Generate the PDF
      const pdfBuffer = await this.generatePDF(tickets);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');

      // Send the PDF as the response
      res.status(200).send(pdfBuffer);
    } else {
      res.status(400).send('Please put a document request format in query');
    }
  };
}
