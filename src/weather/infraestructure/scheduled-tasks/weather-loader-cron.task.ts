import { schedule, ScheduledTask } from 'node-cron';
import { WeatherDataUseCase } from '../../application/interfaces/weather-data-use-case.interface';
import { WeatherLoadingService } from '../../application/services/weather-loading-service';
import { MongoWeatherDataRepository } from '../repositories/mongo-weather-data.repository';
import { OpenWeatherMapClient } from '../clients/open-weather-map.client';

export class WeatherLoaderCronTask {
  private task: ScheduledTask | null = null;
  private readonly weatherLoadingService: WeatherDataUseCase;

  constructor(
    private readonly citiesToLoad: string[],
    private readonly cronSchedule: string
  ) {
    const weatherDataRepository = new MongoWeatherDataRepository();
    const openWeatherMapClient = new OpenWeatherMapClient();
    this.weatherLoadingService = new WeatherLoadingService(weatherDataRepository, openWeatherMapClient);
  }

  public start(): void {
    this.task = schedule(this.cronSchedule, async () => {
      console.info('Starting weather data load job run...');

      try {
        await this.weatherLoadingService.loadWeatherDataForCities(this.citiesToLoad);
        
        console.info('Weather data load job finished successfully.');
      } catch (error) {
        console.error({ err: error }, 'Weather data load job failed.');
      }

    }, {
      timezone: 'America/Argentina/Buenos_Aires', 
    });

    console.info('Cron job has been started.');
  }

  public stop(): void {
    if (this.task) {
      this.task.stop();
      console.info('Cron job has been stopped.');
    }
  }
}