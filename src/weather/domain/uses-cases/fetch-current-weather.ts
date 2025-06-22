import { WeatherDataClient } from '../clients/weather-data-client';
import { ExternalCurrentWeatherData } from '../entities/external-current-weather-data';

export class FetchCurrentWeather {
    constructor(private readonly weatherDataClient: WeatherDataClient) {}

    async execute(city: string): Promise<ExternalCurrentWeatherData | null> {
        return this.weatherDataClient.fetchCurrentWeather(city);
    }
}
