import { Request, Response } from 'express';
import { login, register, signout} from '../authentication';
import { User } from '../../models/user';

// Mocks für Request und Response
const mockRequest = (sessionData: any, bodyData: any) => ({
  body: bodyData,
  session: sessionData,
});

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };
  return res as Response;
};

// Mock für den Datenbankaufruf
jest.mock('../../models/user', () => {
  const originalUser = jest.requireActual('../../models/user');
  return {
    User: {
      getUserByName: jest.fn().mockResolvedValue({
        username: 'testuser',
        password_hash: 'hashedpassword',
      }),
      findOne: jest.fn().mockImplementation((query: any) => {
        if (query.where.username === 'testuser') {
          return Promise.resolve(true); // Benutzer existiert bereits
        }
        return Promise.resolve(false); // Benutzer existiert nicht
      }),
      ...originalUser.User, // Behalte die anderen Funktionen des ursprünglichen Moduls bei
    },
  };
});

describe('Authentication Controller', () => {
  describe('login', () => {
    it('should return success message when valid credentials are provided', async () => {
      const req = mockRequest({}, { username: 'testuser', password: 'testpassword' });
      const res = mockResponse();

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successful signed in!' });
      expect(User.getUserByName).toHaveBeenCalledWith('testuser');
    });
  });

  describe('register', () => {
    it('should return success message with href to login', async () => {
      const req = mockRequest({}, { username: 'testuser', password: 'testpassword' });
      const res = mockResponse();

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successful signed up!',
        links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }],
      });
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });
  });

  describe('signout', () => {
    it('should clear the session and return success message', async () => {
      const req = mockRequest({ jwt: 'mock-jwt-token' }, {});
      const res = mockResponse();

      await signout(req as Request, res as Response);

      expect(req.session).toBeNull();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Successful signed out!' });
    });
  });
});