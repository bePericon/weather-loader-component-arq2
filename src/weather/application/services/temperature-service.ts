import { Logger } from "pino";
import { Temperature } from "../../domain/entities/temperature";
import { WeatherDataRepository } from "../../domain/repositories/weather-data-repository";
import { GetCurrentTemperature } from "../../domain/uses-cases/get-current-temperature";
import { GetLastDayTemperature } from "../../domain/uses-cases/get-last-day-temperature";
import { GetLastWeekTemperature } from "../../domain/uses-cases/get-last-week-temperature";
import { TemperatureDto } from "../dtos/temperature-dto";
import { WeatherDataDto } from "../dtos/weather-data-dto";
import { TemperatureUseCase } from "../interfaces/temperature-use-case.interface";


export class TemperatureService implements TemperatureUseCase {
	private readonly getCurrentTemperatureUseCase: GetCurrentTemperature;
	private readonly getLastDayTemperatureUseCase: GetLastDayTemperature;
	private readonly getLasWeekTemperatureUseCase: GetLastWeekTemperature;


	constructor(readonly weatherDataRepository: WeatherDataRepository, readonly logger: Logger) {
		this.getCurrentTemperatureUseCase = new GetCurrentTemperature(weatherDataRepository);
		this.getLastDayTemperatureUseCase = new GetLastDayTemperature(weatherDataRepository);
		this.getLasWeekTemperatureUseCase = new GetLastWeekTemperature(weatherDataRepository);
	}

	async getLastWeekTemperature(city: string): Promise<TemperatureDto[]> {
		return (await this.getLasWeekTemperatureUseCase.execute(city)).map((t) => this.mapToTemperatureDto(t));
	}

	async getLastDayTemperature(city: string): Promise<TemperatureDto[]> {
		return (await this.getLastDayTemperatureUseCase.execute(city)).map((t) => this.mapToTemperatureDto(t));
	}

    async getCurrentTemperature(city: string): Promise<TemperatureDto | null> {
        const temperature = await this.getCurrentTemperatureUseCase.execute(city);
		return temperature ? this.mapToTemperatureDto(temperature) : null;
    }

	private mapToTemperatureDto(temperature: Temperature): TemperatureDto {
		return temperature;
	}

	public mapToTemperatureDtoFromWeatherData(weatherDataDto: WeatherDataDto): TemperatureDto {
		return {
			weatherDataId: weatherDataDto.weatherDataId as string,
			name: weatherDataDto.name,
			temp: weatherDataDto.main.temp,
			feels_like: weatherDataDto.main.feels_like,
			temp_min: weatherDataDto.main.temp_min,
			temp_max: weatherDataDto.main.temp_max,
		}
	}
}