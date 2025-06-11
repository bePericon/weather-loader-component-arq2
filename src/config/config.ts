import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  db_connection_string: process.env.DB_CONNECTION_STRING,
  base_path: process.env.BASE_PATH,
  openweathermap_api_key: process.env.OPENWEATHERMAP_API_KEY,
  weatherLoaderCronSchedule: process.env.WEATHER_LOADER_CRON_SCHEDULE
};

export default config;
