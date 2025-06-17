import { Logger } from 'pino';
import { ServiceUnavailableError } from '../../../shared/domain/value-objects/service-unavailable-error';
import { WeatherDataClient } from '../../domain/clients/weather-data-client';
import { WeatherData } from '../../domain/entities/weather-data';
import { WeatherDataRepository } from '../../domain/repositories/weather-data-repository';
import { CreateWeatherData } from '../../domain/uses-cases/create-weather-data';
import { FetchCurrentWeather } from '../../domain/uses-cases/fetch-current-weather';
import Coord from '../../domain/value-objects/coord';
import { Main } from '../../domain/value-objects/main';
import { Weather } from '../../domain/value-objects/weather';
import { CreateWeatherDataDto } from '../dtos/create-weather-data-dto';
import { WeatherDataDto } from '../dtos/weather-data-dto';
import { WeatherDataUseCase } from '../interfaces/weather-data-use-case.interface';

export class WeatherLoadingService implements WeatherDataUseCase {
    private readonly logName: string = 'WeatherLoadingService';
    private readonly createWeatherDataUseCase: CreateWeatherData;
    private readonly fetchCurrentWeatherUseCase: FetchCurrentWeather;

    constructor(
        readonly weatherDataRepository: WeatherDataRepository,
        readonly weatherDataClient: WeatherDataClient,
        readonly logger: Logger
    ) {
        this.createWeatherDataUseCase = new CreateWeatherData(weatherDataRepository);
        this.fetchCurrentWeatherUseCase = new FetchCurrentWeather(weatherDataClient);
    }

    async loadWeatherDataForCity(city: string): Promise<WeatherDataDto | null> {
        try {
            const fetched = await this.fetchCurrentWeatherUseCase.execute(city);

            let weatherDataDto = null;
            if (fetched) {
                const createWeatherDataDto: CreateWeatherDataDto = {
                    coord: fetched.coord,
                    weather: fetched.weather[0],
                    main: fetched.main,
                    timezone: fetched.timezone,
                    id: fetched.id,
                    name: fetched.name,
                    cod: fetched.cod,
                };
                weatherDataDto = await this.createWeather(createWeatherDataDto);
            }

            return weatherDataDto;
        } catch (error) {
            this.handleError(error, 'loadWeatherDataForCity');
            return null;
        }
    }

    async loadWeatherDataForCities(cities: string[]): Promise<void> {
        cities.forEach(async (city) => {
            try {
                await this.loadWeatherDataForCity(city);
            } catch (error) {
                this.handleError(error, 'loadWeatherDataForCities');
            }
        });
    }

    async createWeather(
        createWeatherDataDto: CreateWeatherDataDto
    ): Promise<WeatherDataDto> {
        const coord = new Coord({
            lat: createWeatherDataDto.coord.lat,
            lon: createWeatherDataDto.coord.lon,
        });

        const weather = new Weather({
            id: createWeatherDataDto.weather.id,
            main: createWeatherDataDto.weather.main,
            description: createWeatherDataDto.weather.description,
            icon: createWeatherDataDto.weather.icon,
        });

        const main = new Main({
            temp: createWeatherDataDto.main.temp,
            feels_like: createWeatherDataDto.main.feels_like,
            temp_min: createWeatherDataDto.main.temp_min,
            temp_max: createWeatherDataDto.main.temp_max,
            pressure: createWeatherDataDto.main.pressure,
            humidity: createWeatherDataDto.main.humidity,
            sea_level: createWeatherDataDto.main.sea_level,
            grnd_level: createWeatherDataDto.main.grnd_level,
        });

        const weatherData = await this.createWeatherDataUseCase.execute(
            new WeatherData({
                id: createWeatherDataDto.id,
                name: createWeatherDataDto.name,
                timezone: createWeatherDataDto.timezone,
                cod: createWeatherDataDto.cod,
                coord,
                weather,
                main,
            })
        );
        return this.mapToWeatherDataDto(weatherData);
    }

    private mapToWeatherDataDto(weatherData: WeatherData): WeatherDataDto {
        return {
            weatherDataId: weatherData._id,
            name: weatherData.name,
            timezone: weatherData.timezone,
            cod: weatherData.cod,
            coord: weatherData.coord,
            main: weatherData.main,
            weather: weatherData.weather,
            id: weatherData.id,
        };
    }

    private handleError(catchError: any, method: string) {
        if (catchError instanceof ServiceUnavailableError) {
            this.logger.error(
                `[${this.logName}][${method}] ${catchError.message}`
            );
        } else {
            this.logger.error(`[${this.logName}][${method}] An unexpected error occurred while processing city.`);
        }
    }
}
