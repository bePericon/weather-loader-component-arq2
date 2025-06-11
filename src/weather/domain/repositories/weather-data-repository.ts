import { WeatherData } from '../entities/weather-data';

export interface WeatherDataRepository {
  save(entity: WeatherData): Promise<WeatherData>;
}
