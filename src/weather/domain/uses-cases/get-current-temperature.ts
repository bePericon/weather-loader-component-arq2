import { Temperature } from '../entities/temperature';
import { WeatherDataRepository } from '../repositories/weather-data-repository';

export class GetCurrentTemperature {
    constructor(private readonly WeatherDataRepository: WeatherDataRepository) {}

    async execute(city: string): Promise<Temperature | null> {
        if (!city || city.trim() === '') {
            return null;
        }
        return this.WeatherDataRepository.getCurrentTemperature(city);
    }
}
