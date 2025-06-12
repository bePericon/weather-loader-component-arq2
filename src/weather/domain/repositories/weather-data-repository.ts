import { Temperature } from '../entities/temperature';
import { WeatherData } from '../entities/weather-data';

export interface WeatherDataRepository {
    save(entity: WeatherData): Promise<WeatherData>;
    getCurrentTemperature(city: string): Promise<Temperature | null>;
}
