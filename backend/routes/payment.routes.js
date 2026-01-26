import { Router } from "express";
import {
  createPix,
  getStatus,
  webhook
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/pix", createPix);
router.get("/status/:paymentId", getStatus);
router.post("/webhook", webhook);

export default router;
