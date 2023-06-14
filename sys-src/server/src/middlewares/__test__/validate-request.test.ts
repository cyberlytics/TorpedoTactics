import request from 'supertest';
import { app } from '../../app';
import { validateRequest } from '../validate-request';
import { validationResult } from 'express-validator';
jest.mock('../../models/user', () => ({
  create: jest.fn(() => {
    return {};
  }),
}));


describe('validateRequest', () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  beforeAll(() => {
    process.env.JWT_KEY = 'secret';
  });

  it('should not throw a RequestValidationError if validation is successful', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      password: 'passworD1!',
      username: '2',
    });

    expect(response.status).not.toBe(400);
    expect(response.body.errors).toBeUndefined();
  });

  it('should throw a RequestValidationError if validation fails', async () => {
    const response = await request(app).post('/api/auth/signin').send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('calls next when there are no validation errors', () => {
    validationResult(req).isEmpty = jest.fn().mockReturnValue(true);

    validateRequest(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
