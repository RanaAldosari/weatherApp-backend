"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const weather_model_1 = __importDefault(require("../../models/weather.model"));
const history_model_1 = __importDefault(require("../../models/history.model"));
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.WEATHER_API_KEY;
const fetchWeatherFromApi = async (lat, lon) => {
    const response = await axios_1.default.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};
const getWeather = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            return;
        }
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            res.status(400).json({ error: 'Latitude and Longitude are required!' });
            return;
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        if (isNaN(latitude) || isNaN(longitude)) {
            res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
            return;
        }
        const roundedLatitude = parseFloat(latitude.toFixed(2));
        const roundedLongitude = parseFloat(longitude.toFixed(2));
        let weather = await weather_model_1.default.findOne({
            lat: roundedLatitude,
            lon: roundedLongitude,
        });
        if (!weather) {
            const data = await fetchWeatherFromApi(latitude, longitude);
            weather = await weather_model_1.default.create({ lat: roundedLatitude, lon: roundedLongitude, data });
        }
        await history_model_1.default.create({
            user: userId,
            weather: weather._id,
            lat: latitude,
            lon: longitude,
            requestedAt: new Date(),
        });
        res.json(weather.data);
    }
    catch (err) {
        res.status(500).json({
            error: 'Error when fetching weather',
            details: err.message,
        });
    }
};
exports.getWeather = getWeather;
