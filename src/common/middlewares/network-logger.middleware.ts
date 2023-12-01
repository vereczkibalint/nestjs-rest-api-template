import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class NetworkLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const correlationHeader = req.headers['x-correlation-id'];
        const timerStart = process.hrtime();
        const { ip, method, originalUrl, body } = req;
        const userAgent = req.get('user-agent') || '';

        this.logger.log(`
[Request - ${correlationHeader}]: 
[${method}] ${originalUrl}
${JSON.stringify(body)}
`);

        const responseChunks = this.collectResponse(res);

        res.on('finish', () => {
            const { statusCode } = res;
            const responseTime = process.hrtime(timerStart);
            const responseBody = Buffer.concat(responseChunks).toString('utf8');
            this.logger.log(`
[Response - ${correlationHeader}]
[${method}] ${originalUrl} - HTTP ${statusCode} - ${responseTime}ms - ${userAgent} ${ip}
Response body:
${responseBody}
            `);
        });

        next();
    }

    private collectResponse(res: Response): any[] {
        var oldWrite = res.write;
        var oldEnd = res.end;
        var chunks = [];
        res.write = function (chunk: any) {
            chunks.push(chunk);
            return oldWrite.apply(res, arguments);
        };

        res.end = function (chunk: any) {
            if (chunk) {
                chunks.push(chunk);
            }   
            return oldEnd.apply(res, arguments);
        };

        return chunks;
    }
}