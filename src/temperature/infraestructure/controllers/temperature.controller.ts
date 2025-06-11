import { Request, Response } from 'express';
import { Controller, Get, Post } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/domain/value-objects/api-response';
import axios from 'axios';
import config from '../../../config/config';
import { MongoWeatherDataRepository } from '../../../weather/infraestructure/repositories/mongo-weather-data.repository';
import { OpenWeatherMapClient } from '../../../weather/infraestructure/clients/open-weather-map.client';
import { WeatherLoadingService } from '../../../weather/application/services/weather-loading-service';

@Controller('api/temperature')
export class TemperatureController {
  // private readonly temperatureService: TemperatureService;

  constructor() {
    // Inyección de dependencias (adaptador del repositorio)
    // const userRepository = new MongoUserRepository();
    // this.temperatureService = new UserService(userRepository);
  }

  @Post('')
  async getTest(req: Request, res: Response): Promise<Response> {
    const weatherDataRepository = new MongoWeatherDataRepository();
    const openWeatherMapClient = new OpenWeatherMapClient();
    const weatherLoadingService = new WeatherLoadingService(
      weatherDataRepository,
      openWeatherMapClient
    );

    weatherLoadingService.loadWeatherDataForCities([req.body.city]);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(`FUNCIONA CORRECTAMENTE:  ${req.body.city}`, StatusCodes.OK, null)
      );
  }
}
