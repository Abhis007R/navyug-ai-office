import { Request, Response, NextFunction } from "express";
import { supabase } from "../services/supabase";

/**
 * Extend Express Request
 */
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Verify Supabase JWT
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = data.user;

    next();
  } catch (err) {
    console.error("Authentication Error:", err);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};