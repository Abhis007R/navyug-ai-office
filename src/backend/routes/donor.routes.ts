import { Router } from "express";
import { startResearch } from "../controllers/donor.controller";

const router = Router();

/**
 * POST /api/donors/research
 */
router.post("/research", startResearch);

export default router;