import request from 'supertest';
import { Server } from './mock.server';

let server: Server;
let appInstance: Server;
beforeAll(async () => {
  server = new Server();
  await server.start();
  appInstance = server.getServerInstance();
});

afterAll(async () => {
  // Gracefully shut down the server
  await server.stop();
});
describe('supportTicketTest', () => {
  let admin: any = {};
  let customer: any = {};
  let agent: any = {};
  let ticket: any = {};

  describe('registerUser', () => {
    it('should register a new admin user', async () => {
      const newUser = {
        email: 'admin@example.com',
        password: 'password123',
        userName: 'TestAdmin',
        userType: 'admin',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.userName).toBe(newUser.userName);
      expect(response.body.data.user.userType).toBe('ADMIN');
      admin = response.body.data;
    });

    it('should register a new agent user', async () => {
      const newUser = {
        email: 'agent@example.com',
        password: 'password123',
        userName: 'TestAgent',
        userType: 'agent',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.userName).toBe(newUser.userName);
      expect(response.body.data.user.userType).toBe('AGENT');
      agent = response.body.data;
    });

    it('should register a new customer', async () => {
      const newUser = {
        email: 'customer@example.com',
        password: 'password123',
        userName: 'TestCustomer',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.userName).toBe(newUser.userName);
      expect(response.body.data.user.userType).toBe('CUSTOMER');
      customer = response.body.data;
    });

    it('should return an error if user already exists', async () => {
      const existingUser = {
        email: 'admin@example.com',
        password: 'password123',
        userName: 'TestUser',
        userType: 'admin',
      };

      await request(appInstance).post('/register').send(existingUser);

      const response = await request(appInstance)
        .post('/api/v1/auth/register')
        .send(existingUser)
        .expect(400);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('failed');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token and user data', async () => {
      const loginCredentials = {
        email: 'admin@example.com',
        password: 'password123',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/login')
        .send(loginCredentials)
        .expect(200);

      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(loginCredentials.email);
    });

    it('should return an error if the user does not exist', async () => {
      const loginCredentials = {
        email: 'email@example.com',
        password: 'password123',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/login')
        .send(loginCredentials)
        .expect(404);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('failed');
      expect(response.body).toHaveProperty('message');
    });

    it('should return an error if the password is incorrect', async () => {
      const loginCredentials = {
        email: 'admin@example.com',
        password: 'incorrectpassword',
      };

      const response = await request(appInstance)
        .post('/api/v1/auth/login')
        .send(loginCredentials)
        .expect(401);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('failed');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('createTicket', () => {
    it('should create a new ticket', async () => {
      const data = {
        issue: 'the app is not working',
      };

      const response = await request(appInstance)
        .post('/api/v1/ticket')
        .send(data)
        .set('Authorization', `Bearer ${customer.token}`)
        .expect(200);
      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('issue');
      ticket = response.body.data;
    });
  });

  describe('processTicket', () => {
    it('should throw error when ticket is not found', async () => {
      const data = {
        ticket: 'nuidhehdrnfr',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${customer.token}`)
        .expect(400);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('failed');
      expect(response.body).toHaveProperty('message');
    });

    it('should allow commenting by admin', async () => {
      const data = {
        ticket: ticket._id,
        text: 'An agent should look at this issue',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('success');
    });

    it('should throw error when ticket is not open for commenting by customer', async () => {
      const data = {
        ticket: ticket._id,
        text: 'please whats the status of this issue',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${customer.token}`)
        .expect(400);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('failed');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Ticket is not open for commenting');
    });

    it('should allow commenting by agent', async () => {
      const data = {
        ticket: ticket._id,
        text: 'Can you elaborate?',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${agent.token}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('success');
    });

    it('should allow commenting by customer', async () => {
      const data = {
        ticket: ticket._id,
        text: 'My app keeps crashing whenever I try to open it',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${customer.token}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('success');
    });

    it('should allow admin close a ticket', async () => {
      const data = {
        ticket: ticket._id,
        text: 'Ticket closed',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('success');
    });

    it('should allow agent close a ticket', async () => {
      const data = {
        ticket: ticket._id,
        text: 'Ticket closed',
      };

      const response = await request(appInstance)
        .put('/api/v1/ticket/process')
        .send(data)
        .set('Authorization', `Bearer ${agent.token}`)
        .expect(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('success');
    });
  });

  describe('fetchTickets', () => {
    it('should fetch all tickets belonging to a customer', async () => {
      const response = await request(appInstance)
        .get('/api/v1/ticket/customer')
        .set('Authorization', `Bearer ${customer.token}`)
        .expect(200);
      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.status).toBe('success');
    });

    it('should fetch all tickets by admin', async () => {
      const response = await request(appInstance)
        .get('/api/v1/ticket/staff')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);
      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.status).toBe('success');
    });
  });

  describe('generateDocument', () => {
    it('should allow admin generate csv document', async () => {
      const response = await request(appInstance)
        .get('/api/v1/ticket/generate?requestFormat=csv')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);
      expect(response.statusCode).toBe(200);
      expect(response.status).toBe(200);
    });

    it('should allow admin generate pdf document', async () => {
        const response = await request(appInstance)
          .get('/api/v1/ticket/generate?requestFormat=pdf')
          .set('Authorization', `Bearer ${admin.token}`)
          .expect(200);
        expect(response.statusCode).toBe(200);
        expect(response.status).toBe(200);
      });

      it('should allow admin generate pdf document', async () => {
        const response = await request(appInstance)
          .get('/api/v1/ticket/generate?requestFormat=pdf')
          .set('Authorization', `Bearer ${admin.token}`)
          .expect(200);
        expect(response.statusCode).toBe(200);
        expect(response.status).toBe(200);
      });

      it('should throw error when requestFormat is not in query params', async () => {
        const response = await request(appInstance)
          .get('/api/v1/ticket/generate')
          .set('Authorization', `Bearer ${admin.token}`)
          .expect(400);
        expect(response.statusCode).toBe(400);
        expect(response.status).toBe(400);
      });
  });
});
