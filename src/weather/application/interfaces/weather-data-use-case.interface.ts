import { CreateWeatherDataDto } from "../dtos/create-weather-data-dto";
import { WeatherDataDto } from "../dtos/weather-data-dto";

export interface WeatherDataUseCase {
	createWeather(createWeatherDataDto: CreateWeatherDataDto): Promise<WeatherDataDto>;
	loadWeatherDataForCities(cities: string[]): Promise<void>;
}