import { Router } from 'express';
import { getUserHistory } from '../controllers/history.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();
router.get('/',authorized,getUserHistory)

export default router; 