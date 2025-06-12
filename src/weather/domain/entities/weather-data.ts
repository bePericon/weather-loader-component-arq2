import Coord from '../value-objects/coord';
import { Main } from '../value-objects/main';
import { Weather } from '../value-objects/weather';

export interface WeatherDataProps {
    _id?: string;
    coord: Coord;
    weather: Weather;
    main: Main;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export class WeatherData {
    public readonly _id?: string;
    public readonly coord: Coord;
    public readonly weather: Weather;
    public readonly main: Main;
    public readonly timezone: number;
    public readonly id: number;
    public readonly name: string;
    public readonly cod: number;

    constructor(props: WeatherDataProps) {
        this._id = props._id;
        this.coord = props.coord;
        this.weather = props.weather;
        this.main = props.main;
        this.timezone = props.timezone;
        this.id = props.id;
        this.name = props.name;
        this.cod = props.cod;
    }
}
