import { Router } from 'express';
import {getWeather} from '../controllers/weather.controller'
import { authorized } from '../middleware/auth.middleware';

const router = Router();
router.get('/',authorized,getWeather)

export default router; 