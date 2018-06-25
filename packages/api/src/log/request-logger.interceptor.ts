import 'rxjs/add/operator/do';

import { ExecutionContext, Interceptor, NestInterceptor } from '@nestjs/common';
import * as Express from 'express';
import { Observable } from 'rxjs/Observable';
import { LogService } from '.';

@Interceptor()
/**
 * Logs every request
 */
export class RequestLoggerInterceptor implements NestInterceptor {
    private logger: LogService;
    /**
     * Inititalizes the RequestLoggerInterceptor
     * and its logger
     */
    constructor() {
        this.logger = new LogService('Request');
    }

    /**
     * Intercepts every request and logs it
     * @param req The expressjs request object
     * @param context The execution context
     * @param stream$ The stream to for callback
     */
    // @ts-ignore
    intercept(req: any, context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        // Is actually a request
        if (req.method) {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            let message = `Requesting ${req.method}: ${req.originalUrl} with IP ${ip}`;
            if (context) {
                message += ` -> ${context.parent.name}:${context.handler.name}`;
            }
            this.logger.log(message);
        }
        return stream$;
    }
}