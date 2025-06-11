export interface CoordProps {
	lon: number;
	lat: number;
}

export default class Coord {
    private lon: number;
	private lat: number;

	constructor(props: CoordProps) {
		this.lat = props.lat;
		this.lon = props.lon;
	}
}