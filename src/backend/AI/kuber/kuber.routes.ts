import { Router } from "express";
import { kuberController } from "./kuber.controller";

const router = Router();

router.post(
  "/research",
  kuberController.research
);

export default router;