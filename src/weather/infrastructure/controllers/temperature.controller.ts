import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import { MongoWeatherDataRepository } from '../repositories/mongo-weather-data.repository';
import { TemperatureService } from '../../application/services/temperature-service';
import { WeatherLoadingService } from '../../application/services/weather-loading-service';
import { OpenWeatherMapClient } from '../clients/open-weather-map.client';

@Controller('api/temperature')
export class TemperatureController {
    private readonly temperatureService: TemperatureService;
    private readonly weatherLoadingService: WeatherLoadingService;

    constructor() {
        const mongoWeatherDataRepository = new MongoWeatherDataRepository();
        this.temperatureService = new TemperatureService(mongoWeatherDataRepository);

        const openWeatherMapClient = new OpenWeatherMapClient();
        this.weatherLoadingService = new WeatherLoadingService(
            mongoWeatherDataRepository,
            openWeatherMapClient
        );
    }

    @Get('')
    async GetCurrentTemperature(req: Request, res: Response): Promise<Response> {
        const currentTemp = await this.temperatureService.getCurrentTemperature(
            req?.query?.city as string
        );

        let response = null;
        if (!currentTemp) {
            const loaded = await this.weatherLoadingService.loadWeatherDataForCity(
                req.query.city as string
            );

            // TODO: add redis
            if (loaded)
                response =
                    this.temperatureService.mapToTemperatureDtoFromWeatherData(loaded);
        } else response = currentTemp;

        return res
            .status(StatusCodes.OK)
            .json(new ApiResponse(`Temperatura encontrada`, StatusCodes.OK, response));
    }
}
