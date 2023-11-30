import { Catch, HttpException, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        // Exception response contains an array of messages if class-validator fails
        // but if we throw for e.g. UnauthorizedException then it contains only a string
        // as the error message
        const exceptionResponse = exception.getResponse();
 
        response
            .status(status)
            .json({
                statusCode: status,
                message: isArray(exceptionResponse['message']) ? exceptionResponse['message'][0] : exceptionResponse['message'],
                timestamp: new Date().toISOString(),
                path: request.url
            });
    }
}