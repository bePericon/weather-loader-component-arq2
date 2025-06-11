export interface WeatherProps {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export class Weather {
  public readonly id: number;
  public readonly main: string;
  public readonly description: string;
  public readonly icon: string;

  constructor(props: WeatherProps) {
    this.id = props.id;
    this.main = props.main;
    this.description = props.description;
    this.icon = props.icon;
  }
}
