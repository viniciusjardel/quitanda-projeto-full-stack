import crypto from "crypto";
import { paymentMP, supabase } from "../services/pix.service.js";

// =====================
// Criar pagamento PIX
// =====================
export async function createPix(req, res) {
  try {
    const { valor, items, deliveryType } = req.body;

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    const deliveryFee = deliveryType === "entrega" ? 3 : 0;
    const total = Number(valor) + deliveryFee;

    const result = await paymentMP.create({
      body: {
        transaction_amount: total,
        description: "Compra Quitanda Vila Natal",
        payment_method_id: "pix",
        payer: {
          email: "jardelanalista@outlook.com"
        }
      }
    });

    // Salva pedido no Supabase
    await supabase.from("orders").insert({
      payment_id: result.id,
      status: result.status,
      amount: total,
      delivery_type: deliveryType,
      delivery_fee: deliveryFee,
      items
    });

    res.json({
      id: result.id,
      status: result.status,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        result.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error("Erro PIX:", error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}

// =====================
// Consultar status
// =====================
export async function getStatus(req, res) {
  try {
    const { paymentId } = req.params;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_id", paymentId)
      .single();

    if (!data) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json({
      status: data.status,
      amount: data.amount
    });

  } catch (error) {
    console.error("Erro status:", error);
    res.status(500).json({ error: "Erro ao consultar status" });
  }
}

// =====================
// Webhook Mercado Pago
// =====================
export async function webhook(req, res) {
  try {
    const signature = req.headers["x-signature"];
    const requestId = req.headers["x-request-id"];

    if (!signature || !requestId) return res.sendStatus(400);

    const parts = signature.split(",");
    const ts = parts.find(p => p.startsWith("ts="))?.split("=")[1];
    const hash = parts.find(p => p.startsWith("v1="))?.split("=")[1];

    const manifest = `id:${requestId};ts:${ts};`;

    const hmac = crypto
      .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
      .update(manifest)
      .digest("hex");

    if (hmac !== hash) {
      console.warn("Webhook inválido");
      return res.sendStatus(401);
    }

    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    const paymentInfo = await paymentMP.get({ id: paymentId });

    await supabase
      .from("orders")
      .update({ status: paymentInfo.status })
      .eq("payment_id", paymentId);

    console.log("📩 Webhook atualizado:", paymentId, paymentInfo.status);

    res.sendStatus(200);

  } catch (error) {
    console.error("Erro webhook:", error);
    res.sendStatus(500);
  }
}
