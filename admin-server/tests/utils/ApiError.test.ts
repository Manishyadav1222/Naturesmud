import { ApiError } from '../../src/utils/ApiError';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an error with status code and message', () => {
      const error = new ApiError(400, 'Bad Request');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
      expect(error.isOperational).toBe(true);
    });

    it('should create an error with optional errors array', () => {
      const errors = ['Field1 is required', 'Field2 is invalid'];
      const error = new ApiError(422, 'Validation Failed', errors);

      expect(error.errors).toEqual(errors);
    });

    it('should capture stack trace', () => {
      const error = new ApiError(500, 'Internal Server Error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ApiError');
    });
  });

  describe('status codes', () => {
    it('should handle 401 Unauthorized', () => {
      const error = new ApiError(401, 'Unauthorized');
      expect(error.statusCode).toBe(401);
    });

    it('should handle 403 Forbidden', () => {
      const error = new ApiError(403, 'Forbidden');
      expect(error.statusCode).toBe(403);
    });

    it('should handle 404 Not Found', () => {
      const error = new ApiError(404, 'Not Found');
      expect(error.statusCode).toBe(404);
    });

    it('should handle 500 Internal Server Error', () => {
      const error = new ApiError(500, 'Internal Server Error');
      expect(error.statusCode).toBe(500);
    });
  });
});