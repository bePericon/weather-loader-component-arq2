import { TemperatureDto } from "../dtos/temperature-dto";

export interface TemperatureUseCase {
	getCurrentTemperature(city: string): Promise<TemperatureDto | null>;
}