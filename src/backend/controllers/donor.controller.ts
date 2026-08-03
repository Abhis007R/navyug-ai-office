import { Request, Response } from "express";

export async function startResearch(
  req: Request,
  res: Response
) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    return res.json({
      success: true,
      message: "Research started",
      query,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}