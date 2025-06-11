export interface MainProps {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export class Main {
  public readonly temp: number;
  public readonly feels_like: number;
  public readonly temp_min: number;
  public readonly temp_max: number;
  public readonly pressure: number;
  public readonly humidity: number;
  public readonly sea_level: number;
  public readonly grnd_level: number;

  constructor(props: MainProps) {
    this.temp = props.temp;
    this.feels_like = props.feels_like;
    this.temp_min = props.temp_min;
    this.temp_max = props.temp_max;
    this.pressure = props.pressure;
    this.humidity = props.humidity;
    this.sea_level = props.sea_level;
    this.grnd_level = props.grnd_level;
  }
}
