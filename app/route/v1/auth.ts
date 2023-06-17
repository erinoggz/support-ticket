import express, { Router } from 'express';
import di from '../../config/di';
import AuthController from '../../controller/auth.controller';
import adminMiddleware from '../../middleware/admin.middleware';
import authMiddleware from '../../middleware/auth.middleware';
import AuthValidator from '../../validator/auth.validator';

/**
  Express Router for handling routes.
  @type {Router}
*/
const AuthRouter: Router = express.Router();
const authController: AuthController = di.get('authController');
const authValidator: AuthValidator = di.get('authValidator');

AuthRouter.post('/register', authValidator.register, authController.register)
  .post('/login', authValidator.login, authController.login)
  .put('/user/:id', authValidator.updateUser, authMiddleware, adminMiddleware, authController.adminUpdateUser)
  .get('/users', authMiddleware, adminMiddleware, authController.adminGetUsers);

export default AuthRouter;
