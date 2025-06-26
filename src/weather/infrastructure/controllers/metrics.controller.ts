import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'pino';

@Controller('metrics')
export default class MetricsController {
    constructor(private readonly logger: Logger) {}

    @Get('')
    private async metrics(req: Request, res: Response) {
        this.logger.info(req.body, true);

        res.setHeader('Content-Type', req.metrics.register.contentType);
        res.send(await req.metrics.register.metrics());
    }
}
