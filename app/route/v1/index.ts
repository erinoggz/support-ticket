import express, { Router } from 'express';
import AuthRouter from './auth';
import TicketRouter from './ticket';
/**
 * export all registered routers. And give them base routes
 */
const AppRouter: Router = express.Router();

AppRouter.use('/auth', AuthRouter);
AppRouter.use('/ticket', TicketRouter);

export default AppRouter;
