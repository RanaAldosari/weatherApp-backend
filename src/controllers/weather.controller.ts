import { Request, Response } from 'express';
import Weather from '../models/weather.model';
import History from '../models/history.model';
import axios from 'axios';

const API_KEY = process.env.WEATHER_API_KEY;

const fetchWeatherFromApi = async (lat: number, lon: number) => {
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User not authenticated' });
      return;
    }

    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and Longitude are required!' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
      return;
    }

    const roundedLatitude = parseFloat(latitude.toFixed(2));
    const roundedLongitude = parseFloat(longitude.toFixed(2));

    let weather = await Weather.findOne({
      lat: roundedLatitude,
      lon: roundedLongitude,
    });

    if (!weather) {
      const data = await fetchWeatherFromApi(latitude, longitude);
      weather = await Weather.create({ lat: roundedLatitude, lon: roundedLongitude, data });
    }

    await History.create({
      user: userId,
      weather: weather._id,
      lat: latitude,
      lon: longitude,
      requestedAt: new Date(), 
    });

    res.json(weather.data);

  } catch (err: any) {
    res.status(500).json({
      error: 'Error when fetching weather',
      details: err.message,
    });
  }
};
