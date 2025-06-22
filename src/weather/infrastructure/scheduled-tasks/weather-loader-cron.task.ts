import { schedule, ScheduledTask } from 'node-cron';
import { WeatherDataUseCase } from '../../application/interfaces/weather-data-use-case.interface';
import { WeatherLoadingService } from '../../application/services/weather-loading-service';
import { MongoWeatherDataRepository } from '../repositories/mongo-weather-data.repository';
import { OpenWeatherMapClient } from '../clients/open-weather-map.client';
import { Logger } from 'pino';

export class WeatherLoaderCronTask {
    private logName: string = 'WeatherLoaderCronTask';
    private task: ScheduledTask | null = null;
    private readonly weatherLoadingService: WeatherDataUseCase;

    constructor(
        private readonly citiesToLoad: string[],
        private readonly cronSchedule: string,
        private readonly logger: Logger
    ) {
        const weatherDataRepository = new MongoWeatherDataRepository(logger);
        const openWeatherMapClient = new OpenWeatherMapClient(logger);
        this.weatherLoadingService = new WeatherLoadingService(
            weatherDataRepository,
            openWeatherMapClient,
            logger
        );
    }

    public start(): void {
        this.task = schedule(
            this.cronSchedule,
            async () => {
                this.logger.info(
                    `[${this.logName}] Starting weather data load job run...`
                );

                await this.weatherLoadingService.loadWeatherDataForCities(
                    this.citiesToLoad
                );

                this.logger.info(
                    `[${this.logName}] Weather data load job finished successfully.`
                );
            },
            {
                timezone: 'America/Argentina/Buenos_Aires',
            }
        );

        this.logger.info(`[${this.logName}] Cron job has been started.`);
    }

    public stop(): void {
        if (this.task) {
            this.task.stop();
            this.logger.info(`[${this.logName}] Cron job has been stopped.`);
        }
    }
}
