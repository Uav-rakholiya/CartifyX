import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
}

export interface AuthRequest extends Request {
  user?: DecodedToken['user'];
}


export default function (req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
    // @ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
    // @ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    // For optional auth, just ignore invalid tokens and treat as guest
    next();
  }
}