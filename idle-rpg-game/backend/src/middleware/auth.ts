import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user: User;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Add user info to request
    req.user = decoded.user;
    next();
  });
};

export const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload = { 
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };

  return jwt.sign(payload, jwtSecret, { 
    expiresIn: '24h'
  });
};

export const verifyToken = (token: string): any => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.verify(token, jwtSecret);
};