import axios from 'axios';
import { WeatherDataClient } from '../../domain/clients/weather-data-client';
import { ExternalCurrentWeatherData } from '../../domain/entities/external-current-weather-data';
import config from '../../../config/config';

export class OpenWeatherMapClient implements WeatherDataClient {
  async fetchCurrentWeather(city: string): Promise<ExternalCurrentWeatherData | null> {

    let externalCurrentWeatherData = null
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openweathermap_api_key}&lang=sp&units=metric`;
      const { data } = await axios.get(url);
      externalCurrentWeatherData = data
      
    } catch (error) {
      console.log("🚀 ~ OpenWeatherMapClient ~ fetchCurrentWeather ~ error:", error)
    }
    return externalCurrentWeatherData;
  }
}
