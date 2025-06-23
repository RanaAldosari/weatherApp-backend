import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';


interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authorized = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: ' No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      user: { id: string; role: string };
    };

    req.user = {
      userId: decoded.user.id,
      role: decoded.user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: ' Invalid token' });
  }
};
