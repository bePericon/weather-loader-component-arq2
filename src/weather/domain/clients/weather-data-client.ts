import { ExternalCurrentWeatherData } from "../entities/external-current-weather-data";

export interface WeatherDataClient {
  fetchCurrentWeather(city: string): Promise<ExternalCurrentWeatherData | null>;
}