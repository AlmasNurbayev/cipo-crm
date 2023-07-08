import { ArgumentsHost, Catch, HttpStatus  } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { logger } from '../utils/logs';

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    //console.error(exception.message);
    logger.error('Prisma filter - ' + exception.message);
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    //console.log(exception.code);

    if (message.includes('Got invalid value')) {
      let status0 = HttpStatus.BAD_REQUEST;
      response.status(status0).json({
        statusCode: status0,
        message: message,
      });     
    }

    if (message.includes('but not found')) {
      let status0 = HttpStatus.NOT_FOUND;
      response.status(status0).json({
        statusCode: status0,
        message: 'object not found',
        error: 'Not Found'
      });     
    }
    
    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'Unique constraint failed',
        });
        break;
      }
   
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }



  }
}
