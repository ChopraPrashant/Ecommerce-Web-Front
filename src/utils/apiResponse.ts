import { Response } from 'express';
import { logger } from './logger';

/**
 * Standard API response handler
 */
class ApiResponseHandler {
  /**
   * Sends a success response with data
   * @param res - Express response object
   * @param data - Response data
   * @param message - Optional success message
   * @param statusCode - HTTP status code (default: 200)
   */
  static success(
    res: Response,
    data: any = null,
    message: string = 'Success',
    statusCode: number = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Sends an error response
   * @param res - Express response object
   * @param error - Error object or message
   * @param statusCode - HTTP status code (default: 500)
   */
  static error(
    res: Response,
    error: Error | string = 'Internal Server Error',
    statusCode: number = 500
  ) {
    const errorMessage = error instanceof Error ? error.message : error;
    
    // Log the error for server-side debugging
    if (statusCode >= 500) {
      logger.error(`[API Error] ${errorMessage}`, {
        statusCode,
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' && error instanceof Error 
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    });
  }

  /**
   * Sends a validation error response
   * @param res - Express response object
   * @param errors - Validation errors
   * @param message - Optional error message
   */
  static validationError(
    res: Response,
    errors: Record<string, string[]> | string[],
    message: string = 'Validation Error'
  ) {
    return res.status(400).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * Sends a not found response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ) {
    return this.error(res, message, 404);
  }

  /**
   * Sends an unauthorized response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ) {
    return this.error(res, message, 401);
  }

  /**
   * Sends a forbidden response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden: Insufficient permissions'
  ) {
    return this.error(res, message, 403);
  }

  /**
   * Sends a bad request response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static badRequest(
    res: Response,
    message: string = 'Bad Request'
  ) {
    return this.error(res, message, 400);
  }

  /**
   * Sends a conflict response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static conflict(
    res: Response,
    message: string = 'Conflict: Resource already exists'
  ) {
    return this.error(res, message, 409);
  }

  /**
   * Sends a rate limit exceeded response
   * @param res - Express response object
   * @param message - Optional error message
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests, please try again later.'
  ) {
    return this.error(res, message, 429);
  }

  /**
   * Sends a created response
   * @param res - Express response object
   * @param data - Response data
   * @param message - Optional success message
   */
  static created(
    res: Response,
    data: any = null,
    message: string = 'Resource created successfully'
  ) {
    return this.success(res, data, message, 201);
  }

  /**
   * Sends a no content response
   * @param res - Express response object
   */
  static noContent(res: Response) {
    return res.status(204).end();
  }
}

export default ApiResponseHandler;
