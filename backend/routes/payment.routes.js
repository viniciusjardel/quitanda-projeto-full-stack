import express from "express";
import {
  createPixPayment,
  getOrderStatus,
  mercadoPagoWebhook
} from "../services/pix.service.js";

const router = express.Router();

// Criar pedido + Pix
router.post("/pay", createPixPayment);

// Consultar status do pedido
router.get("/order/:orderId", getOrderStatus);

// Webhook Mercado Pago
router.post("/webhook", mercadoPagoWebhook);

export default router;
