import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import { TemperatureService } from '../../application/services/temperature-service';
import { WeatherLoadingService } from '../../application/services/weather-loading-service';
import { OpenWeatherMapClient } from '../clients/open-weather-map.client';
import { MongoWeatherDataRepository } from '../repositories/mongo-weather-data.repository';
import { Logger } from 'pino';

@Controller('api/temperature')
export class TemperatureController {
    private readonly temperatureService: TemperatureService;
    private readonly weatherLoadingService: WeatherLoadingService;

    constructor(private readonly logger: Logger) {
        const mongoWeatherDataRepository = new MongoWeatherDataRepository(logger);
        this.temperatureService = new TemperatureService(
            mongoWeatherDataRepository,
            logger
        );

        const openWeatherMapClient = new OpenWeatherMapClient(logger);
        this.weatherLoadingService = new WeatherLoadingService(
            mongoWeatherDataRepository,
            openWeatherMapClient,
            logger
        );
    }

    @Get('last-day')
    async GetLastDayTemperature(req: Request, res: Response): Promise<Response> {
        const start = Date.now();
        try {
            req.metrics.requestCounter.inc({
                method: req.method,
                status_code: res.statusCode,
            });
            this.logger.info(`BEGIN: [TemperatureController.GetLastDayTemperature]`);

            const lastDayTemperature =
                await this.temperatureService.getLastDayTemperature(
                    req?.query?.city as string
                );

            return res
                .status(StatusCodes.OK)
                .json(
                    new ApiResponse(
                        `Temperaturas del ultimo dia encontradas`,
                        StatusCodes.OK,
                        lastDayTemperature
                    )
                );
        } finally {
            const responseTimeInMs = Date.now() - start;
            req.metrics.httpRequestTimer
                .labels(req.method, req.route.path, res.statusCode.toString())
                .observe(responseTimeInMs);
            this.logger.info(`END: [TemperatureController.GetLastDayTemperature]`);
        }
    }

    @Get('last-week')
    async GetLastWeekTemperature(req: Request, res: Response): Promise<Response> {
        const start = Date.now();
        try {
            req.metrics.requestCounter.inc({
                method: req.method,
                status_code: res.statusCode,
            });
            this.logger.info(`BEGIN: [TemperatureController.GetLastWeekTemperature]`);

            const lastWeekTemperature =
                await this.temperatureService.getLastWeekTemperature(
                    req?.query?.city as string
                );

            return res
                .status(StatusCodes.OK)
                .json(
                    new ApiResponse(
                        `Temperaturas de la ultima semana encontradas`,
                        StatusCodes.OK,
                        lastWeekTemperature
                    )
                );
        } finally {
            const responseTimeInMs = Date.now() - start;
            req.metrics.httpRequestTimer
                .labels(req.method, req.route.path, res.statusCode.toString())
                .observe(responseTimeInMs);
            this.logger.info(`END: [TemperatureController.GetLastWeekTemperature]`);
        }
    }

    @Get('')
    async GetCurrentTemperature(req: Request, res: Response): Promise<Response> {
        const start = Date.now();
        try {
            req.metrics.requestCounter.inc({
                method: req.method,
                status_code: res.statusCode,
            });
            this.logger.info(`BEGIN: [TemperatureController.GetCurrentTemperature]`);

            const currentTemp = await this.temperatureService.getCurrentTemperature(
                req?.query?.city as string
            );

            let response = null;
            if (!currentTemp) {
                const loaded = await this.weatherLoadingService.loadWeatherDataForCity(
                    req.query.city as string
                );

                if (loaded)
                    response =
                        this.temperatureService.mapToTemperatureDtoFromWeatherData(
                            loaded
                        );
            } else response = currentTemp;

            return res
                .status(StatusCodes.OK)
                .json(
                    new ApiResponse(`Temperatura encontrada`, StatusCodes.OK, response)
                );
        } finally {
            const responseTimeInMs = Date.now() - start;
            req.metrics.httpRequestTimer
                .labels(req.method, req.route.path, res.statusCode.toString())
                .observe(responseTimeInMs);
            this.logger.info(`END: [TemperatureController.GetCurrentTemperature]`);
        }
    }
}
