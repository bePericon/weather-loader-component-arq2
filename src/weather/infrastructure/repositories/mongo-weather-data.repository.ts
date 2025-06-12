import config from '../../../config/config';
import { Temperature } from '../../domain/entities/temperature';
import { WeatherData } from '../../domain/entities/weather-data';
import { WeatherDataRepository } from '../../domain/repositories/weather-data-repository';
import weatherDataModel from '../models/weather-data.model';

export class MongoWeatherDataRepository implements WeatherDataRepository {
    async getCurrentTemperature(city: string): Promise<Temperature | null> {
        const last = await weatherDataModel
            .findOne({ name: city })
            .sort({ createdAt: -1 })
            .exec();

        if (last) {
            const now = new Date().getTime();
            const createdAt = new Date(last.createdAt).getTime();
            const diff = now - createdAt;

            if (diff <= config.msGapTimeForResearchCurrentWeather) {
                return this.mapToTemperature(last as unknown as WeatherData);
            }
        }
        return null;
    }

    async save(entity: WeatherData): Promise<any> {
        const createdWeatherData = new weatherDataModel(entity);
        await createdWeatherData.save();
        return createdWeatherData;
    }

    private mapToTemperature(weatherData: WeatherData): Temperature {
        return {
            feels_like: weatherData.main.feels_like,
            temp: weatherData.main.temp,
            temp_max: weatherData.main.temp_max,
            temp_min: weatherData.main.temp_min,
            weatherDataId: weatherData._id as string,
            name: weatherData.name,
        };
    }
}
