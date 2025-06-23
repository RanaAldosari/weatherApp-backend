import express from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller';

const router = express.Router();
// authintication-path
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

export default router;
