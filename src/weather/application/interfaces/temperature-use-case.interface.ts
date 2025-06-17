import { TemperatureDto } from "../dtos/temperature-dto";

export interface TemperatureUseCase {
	getCurrentTemperature(city: string): Promise<TemperatureDto | null>;
	getLastDayTemperature(city: string): Promise<TemperatureDto[]>;
	getLastWeekTemperature(city: string): Promise<TemperatureDto[]>;
}