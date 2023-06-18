import {  NextFunction } from 'express';
import { errorHandler } from "../error-handler";

describe('errorHandler', () => {
  const mockRequest: any = {};
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  const mockNext: NextFunction = jest.fn();

  it('sends an INTERNAL_SERVER_ERROR response for a generic error', () => {
    const genericError = new Error('Test error');

    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [
        {
          error_spec: {
            name: 'INTERNAL_SERVER_ERROR',
            message: genericError.message,
            log_level: 'ERROR',
            http_status_codes: [500],
            suggested_application_actions: ['Please check logs'],
          },
        },
      ],
    });
  });
});
