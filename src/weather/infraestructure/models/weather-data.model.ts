import mongoose, { Schema } from 'mongoose';

const coordSchema = new Schema(
    {
    lon: { type: Number, required: true },
    lat: { type: Number, required: true },
    },
    { _id: false }
);

const weatherSchema = new Schema(
    {
        id: { type: Number, required: true },
        main: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
    },
    { _id: false }
);

const mainSchema = new Schema(
    {
        temp: { type: Number, required: true },
        feels_like: { type: Number, required: true },
        temp_min: { type: Number, required: true },
        temp_max: { type: Number, required: true },
        pressure: { type: Number, required: true },
        humidity: { type: Number, required: true },
        sea_level: { type: Number, required: true },
        grnd_level: { type: Number, required: true },
    },
    { _id: false }
)

const weatherDataSchema = new Schema({
    name: { type: String, required: true },
    cod: { type: Number, required: true },
    timezone: { type: Number, required: true },
    id: { type: Number, required: true },
    coord: coordSchema,
    weather: weatherSchema,
    main: mainSchema,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WeatherData', weatherDataSchema);
