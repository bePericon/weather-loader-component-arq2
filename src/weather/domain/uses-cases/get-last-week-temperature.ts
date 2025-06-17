import { Temperature } from '../entities/temperature';
import { WeatherDataRepository } from '../repositories/weather-data-repository';

export class GetLastWeekTemperature {
    constructor(private readonly WeatherDataRepository: WeatherDataRepository) {}

    async execute(city: string): Promise<Temperature[]> {
        if (!city || city.trim() === '') {
            return [];
        }
        return this.WeatherDataRepository.getLastWeekTemperature(city);
    }
}
