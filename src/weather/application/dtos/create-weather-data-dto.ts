export interface CreateWeatherDataDto {
  coord: any;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  main: any;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
