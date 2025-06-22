import { Logger } from 'pino';
import config from '../../../config/config';
import { Temperature } from '../../domain/entities/temperature';
import { WeatherData } from '../../domain/entities/weather-data';
import { WeatherDataRepository } from '../../domain/repositories/weather-data-repository';
import weatherDataModel from '../models/weather-data.model';

export class MongoWeatherDataRepository implements WeatherDataRepository {
    private readonly logName = 'MongoWeatherDataRepository';
    constructor(private readonly logger: Logger){}

    async getLastWeekTemperature(city: string): Promise<Temperature[]> {
        const now = new Date();
        const startOfWeek = new Date(now);
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        startOfWeek.setDate(now.getDate() - daysToSubtract);
        startOfWeek.setHours(0, 0, 0, 0);

        this.logger.info(`[${this.logName}] Searching weather data from: ${startOfWeek.toISOString()}`);
        this.logger.info(`[${this.logName}] Searching weather data to:  ${now.toISOString()}`);

        const results = await weatherDataModel
            .find({
                name: city,
                createdAt: {
                    $gte: startOfWeek, // $gte: Greater Than or Equal
                    $lte: now, // $lte: Less Than or Equal
                },
            })
            .sort({ createdAt: 'asc' });

        this.logger.info(`[${this.logName}] Found ${results.length} registers for the last week: ${city}`);

        return results.map((t) => this.mapToTemperature(t as unknown as WeatherData));
    }

    async getLastDayTemperature(city: string): Promise<Temperature[]> {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        this.logger.info(`[${this.logName}] Searching weather data from: ${startOfToday.toISOString()}`);
        this.logger.info(`[${this.logName}] Searching weather data to:   ${now.toISOString()}`);

        const results = await weatherDataModel
            .find({
                name: city,
                createdAt: {
                    $gte: startOfToday, // Mayor o igual que la medianoche de hoy
                    $lte: now, // Menor o igual que el momento actual
                },
            })
            .sort({ createdAt: 'desc' }); // Opcional: ordenar del más reciente al más antiguo

        this.logger.info(`[${this.logName}] Found ${results.length} registers for the last day: ${city}`);

        return results.map((t) => this.mapToTemperature(t as unknown as WeatherData));
    }

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
            timestamp: weatherData.createdAt? weatherData.createdAt.toISOString() : '',
        };
    }
}
