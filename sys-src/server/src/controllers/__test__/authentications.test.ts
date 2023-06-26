import { Request, Response } from 'express';
import {
  login,
  register,
  signout,
} from '../authentication';

// Mocks fÃ¼r Request und Response
const mockRequest = (sessionData: any, bodyData: any) => ({
  body: bodyData,
  session: sessionData,
});

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  return res as Response;
};

describe('Authentication Controller', () => {
  describe('login', () => {
    it('should return success message when valid credentials are provided', async () => {
      const req = mockRequest({}, { username: 'testuser', password: 'testpassword' });
      const res = mockResponse();

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Successful signed in!' });
    });
  });

  describe('register', () => {
    it('should return success message with href to login', async () => {
      const req = mockRequest({}, { username: 'testuser', password: 'testpassword' });
      const res = mockResponse();

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Successful signed up!',
        links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }],
      });
    });
  });

  describe('signout', () => {
    it('should clear the session and return success message', async () => {
      const req = mockRequest({ jwt: 'mock-jwt-token' }, {});
      const res = mockResponse();

      await signout(req as Request, res as Response);

      expect(req.session).toBeNull();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Successful signed out!' });
    });
  });
});