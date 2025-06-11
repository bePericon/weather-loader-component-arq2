import { WeatherData } from '../../domain/entities/weather-data';
import { WeatherDataRepository } from '../../domain/repositories/weather-data-repository';
import weatherDataModel from '../models/weather-data.model';

export class MongoWeatherDataRepository implements WeatherDataRepository {
  async save(entity: WeatherData): Promise<any> {
    const createdWeatherData = new weatherDataModel(entity);
    await createdWeatherData.save();
    return createdWeatherData;
  }
}
