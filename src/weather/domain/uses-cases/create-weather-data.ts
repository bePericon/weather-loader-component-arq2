import { WeatherData } from '../entities/weather-data';
import { WeatherDataRepository } from '../repositories/weather-data-repository';

export class CreateWeatherData {
  constructor(private readonly WeatherDataRepository: WeatherDataRepository) {}

  async execute(weatherData: WeatherData): Promise<WeatherData> {
    return this.WeatherDataRepository.save(weatherData);
  }
}
