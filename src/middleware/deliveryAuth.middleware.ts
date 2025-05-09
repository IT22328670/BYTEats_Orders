// middleware/deliveryAuth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authenticateDeliveryPerson = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    
    // Check if the user has the delivery person role
    if (decoded.role !== 'delivery') {
      return res.status(403).json({ error: "Not authorized as delivery person" });
    }
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
