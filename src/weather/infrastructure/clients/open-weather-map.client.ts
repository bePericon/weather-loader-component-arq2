import axios from 'axios';
import { WeatherDataClient } from '../../domain/clients/weather-data-client';
import { ExternalCurrentWeatherData } from '../../domain/entities/external-current-weather-data';
import config from '../../../config/config';
import CircuitBreaker from 'opossum';
// import { ServiceUnavailableError } from '../../../shared/domain/value-objects/service-unavailable-error';
import { Logger } from 'pino';

export class OpenWeatherMapClient implements WeatherDataClient {
    private logName: string = 'OpenWeatherMapClient';
    private circuitBreaker: CircuitBreaker;

    constructor(private readonly logger: Logger) {
        const options: CircuitBreaker.Options = {
            timeout: 3000, // Si la llamada tarda más de 3s, se considera un fallo.
            errorThresholdPercentage: 30, // Si el 30% de las llamadas fallan, se abre el circuito.
            resetTimeout: 30000, // Después de 30s en estado ABIERTO, pasará a SEMI-ABIERTO.
        };

        this.circuitBreaker = new CircuitBreaker(
            (city: string) => this.makeApiCall(city),
            options
        );

        this.circuitBreaker.fallback(() => {
            // throw new ServiceUnavailableError(
            //     `[${this.logName}] OpenWeatherMap API is currently unavailable (Circuit Breaker is OPEN)`
            // );
            this.logger.error(
                `[${this.logName}] OpenWeatherMap API is currently unavailable (Circuit Breaker is OPEN)`
            );
            return;
        });

        this.addEventListeners();
    }

    async fetchCurrentWeather(city: string): Promise<any> {
        this.logger.info(
            `[${this.logName}] Requesting weather data for ${city} via Circuit Breaker.`
        );
        return this.circuitBreaker.fire(city);
    }

    private async makeApiCall(city: string): Promise<ExternalCurrentWeatherData | null> {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openweathermap_api_key}&lang=sp&units=metric`;
        const { data } = await axios.get(url, { timeout: 3000 });
        return data;
    }

    private addEventListeners(): void {
        const serviceName = 'OpenWeatherMap';
        this.circuitBreaker.on('open', () =>
            this.logger.warn(
                `[${this.logName}] Circuit Breaker for ${serviceName} has opened.`
            )
        );
        this.circuitBreaker.on('close', () =>
            this.logger.info(
                `[${this.logName}] Circuit Breaker for ${serviceName} has closed.`
            )
        );
        this.circuitBreaker.on('halfOpen', () =>
            this.logger.warn(
                `[${this.logName}] Circuit Breaker for ${serviceName} is half-open.`
            )
        );
        this.circuitBreaker.on('failure', (error) =>
            this.logger.error(
                { error: error },
                `[${this.logName}] Circuit Breaker recorded a failure for ${serviceName}: ${error}`
            )
        );
        this.circuitBreaker.on('success', () =>
            this.logger.info(
                `[${this.logName}] Circuit Breaker recorded a success for ${serviceName}.`
            )
        );
        this.circuitBreaker.on('fallback', () =>
            this.logger.warn(
                `[${this.logName}] Circuit Breaker fallback executed for ${serviceName}.`
            )
        );
    }
}
