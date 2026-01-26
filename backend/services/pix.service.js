import crypto from "crypto";
import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * 🔹 Criar pedido + pagamento Pix
 */
export async function createPixPayment(req, res) {
  try {
    const { total, email } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    const orderId = crypto.randomUUID();

    // 1️⃣ Cria pedido no banco
    await supabase.from("orders").insert({
      order_id: orderId,
      total,
      status: "pending"
    });

    // 2️⃣ Cria Pix no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: total,
      description: `Pedido ${orderId}`,
      payment_method_id: "pix",
      external_reference: orderId,
      payer: { email }
    });

    return res.json({
      orderId,
      paymentId: payment.body.id,
      qrCode: payment.body.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64:
        payment.body.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (err) {
    console.error("❌ Erro ao criar Pix:", err);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}

/**
 * 🔹 Consultar status do pedido
 */
export async function getOrderStatus(req, res) {
  const { orderId } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .select("status")
    .eq("order_id", orderId)
    .single();

  if (error) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  return res.json(data);
}

/**
 * 🔹 Webhook Mercado Pago
 */
export async function mercadoPagoWebhook(req, res) {
  try {
    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    const payment = await mercadopago.payment.get(paymentId);
    const status = payment.body.status;
    const orderId = payment.body.external_reference;

    if (!orderId) return res.sendStatus(200);

    await supabase
      .from("orders")
      .update({ status })
      .eq("order_id", orderId);

    console.log(`✅ Pedido ${orderId} atualizado para ${status}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook erro:", err);
    res.sendStatus(500);
  }
}
