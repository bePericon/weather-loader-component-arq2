export interface ExternalCurrentWeatherDataProps {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export class ExternalCurrentWeatherData {
  public readonly timezone: number;
  public readonly id: number;
  public readonly name: string;
  public readonly cod: number;
  public readonly dt: number;
  public readonly sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  public readonly main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  public readonly weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  public readonly wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  public readonly clouds: {
    all: number;
  };
  public readonly coord: {
    lon: number;
    lat: number;
  };
  public readonly base: string;
  public readonly visibility: number;

  constructor(props: ExternalCurrentWeatherDataProps) {
    this.timezone = props.timezone;
    this.id = props.id;
    this.name = props.name;
    this.cod = props.cod;
    this.dt = props.dt;
    this.sys = props.sys;
    this.main = props.main;
    this.weather = props.weather;
    this.wind = props.wind;
    this.clouds = props.clouds;
    this.coord = props.coord;
    this.base = props.base;
    this.visibility = props.visibility;
  }
}
