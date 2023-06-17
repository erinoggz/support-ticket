import express, { Application } from 'express';
import Routes from '../route';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

import di from '../config/di';
import { LoggerService } from '../service/logger.service';
import jwtMiddleware from '../middleware/jwt.middleware';
import StatusCodes from '../lib/response/status-codes';
import response from '../lib/response';
import { MongoMemoryServer } from 'mongodb-memory-server';

const logger: LoggerService = di.get('logger');

export class Server {
  /**
    The Express application instance.
    @readonly
    @type {Application}
  */
  private app: Application;
  private serverInstance: any;
  constructor() {
    this.app = express();
  }

  /**
    Establishes the connection to the MongoDB database.
    @private
    * @return {void}
  */
  private mongooseConnection(): void {
    mongoose.set('strictQuery', false);
    MongoMemoryServer.create().then((result) => {
      mongoose
        .connect(result.getUri())
        .then(() => logger.log('Test Database Connected'))
        .catch((err) => {
          logger.error(err);
        });

      mongoose.connection.on('error', (err) => {
        logger.error(`Test DB error: ${err.message}`);
      });
    });
  }

  /**
    Configures the server by establishing the database connection,
    setting up middleware, and mounting routes.
     * @return {void}
  */
  public configuration(): void {
    this.mongooseConnection();
    this.app.use(response);
    this.app.use(cors());
    this.app.use(express.json());

    // Initialize passport middleware
    this.app.use(passport.initialize());
    jwtMiddleware(passport);

    this.app.get('/', (req, res) => {
      res.status(StatusCodes.OK).json('starting...');
    });

    // Mount routes
    Routes(this.app);
  }

  /**
    Starts the server by listening on the configured port and
    executing the configuration steps
    * @return {Promise<void>}
  */
  public async start(): Promise<void> {
    this.configuration();
    this.serverInstance = this.app.listen(7789, () => {
      logger.log(`Server is listening on port 3211.`);
    });
  }

  /**
    Stops the server by closing the server instance
    * @return {void}
  */
  public stop(): void {
    if (this.serverInstance) {
      this.serverInstance.close();
      logger.log('Server has been stopped.');
    }
  }
/**
   * Returns the underlying HTTP server instance.
   * @returns {http.Server} The HTTP server instance.
   */
  public getServerInstance(): any {
    return this.app;
  }
}