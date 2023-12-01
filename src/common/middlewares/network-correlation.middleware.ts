import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NetworkCorrelationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const correlationHeader = req.headers['x-correlation-id'] || this.generateCorrelationId();
        req.headers['x-correlation-id'] = correlationHeader;
        res.set('x-correlation-id', correlationHeader);

        next();
    }

    private generateCorrelationId(): string {
        return uuidv4() as string;
    }
}