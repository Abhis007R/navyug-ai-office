import { Request, Response } from "express";
import { supabase } from "../services/supabase";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * Register User
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "user",
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Login User
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Logged-in User
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

/**
 * Verify Token
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response
) => {
  return res.json({
    success: true,
    valid: true,
    user: req.user,
  });
};

/**
 * Logout
 */
export const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "http://localhost:5173/reset-password",
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { password } = req.body;

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Google Login
 * OAuth flow should normally be initiated from the frontend.
 */
export const googleLogin = async (
  req: Request,
  res: Response
) => {
  return res.status(501).json({
    success: false,
    message:
      "Start Google OAuth from the frontend using supabase.auth.signInWithOAuth().",
  });
};