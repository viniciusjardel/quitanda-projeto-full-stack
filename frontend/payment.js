const API_URL = "https://quitanda-projeto-full-stack-1.onrender.com";

const valorEl = document.getElementById("valor");
const qrImg = document.getElementById("qr-code");
const pixChaveEl = document.getElementById("pix-chave");
const statusEl = document.getElementById("status");

let paymentId = localStorage.getItem("paymentId");

// ===============================
// Recupera valor do carrinho
// ===============================
const totalCompra = Number(localStorage.getItem("totalCompra"));

if (!totalCompra || totalCompra <= 0) {
  alert("Nenhum valor encontrado para pagamento.");
  window.location.href = "index.html";
}

valorEl.innerText = `Valor do PIX: R$ ${totalCompra.toFixed(2)}`;

// ===============================
// Criar pagamento PIX
// ===============================
async function criarPix() {
  try {
    statusEl.innerText = "⏳ Processando pagamento...";

    const response = await fetch(`${API_URL}/pix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valor: totalCompra,
        descricao: "Compra Quitanda Villa Natal"
      })
    });

    if (!response.ok) {
      throw new Error("Erro ao criar PIX");
    }

    const data = await response.json();

    paymentId = data.id;
    localStorage.setItem("paymentId", paymentId);

    qrImg.src = `data:image/png;base64,${data.qr_code_base64}`;
    pixChaveEl.innerText = data.qr_code;

    iniciarPolling();
  } catch (err) {
    console.error(err);
    statusEl.innerText = "❌ Erro ao gerar PIX";
  }
}

// ===============================
// Consultar status do pagamento
// ===============================
async function consultarStatus() {
  try {
    const response = await fetch(`${API_URL}/status/${paymentId}`);

    if (!response.ok) return;

    const data = await response.json();

    if (data.status === "approved") {
      statusEl.innerText = "✅ Pagamento aprovado!";
      localStorage.setItem("pagamentoAprovado", "true");
    } else {
      statusEl.innerText = "⏳ Aguardando pagamento...";
    }
  } catch (err) {
    console.error(err);
  }
}

// ===============================
// Polling automático
// ===============================
function iniciarPolling() {
  consultarStatus();
  setInterval(consultarStatus, 4000);
}

// ===============================
// Ao carregar a página
// ===============================
const pagamentoAprovado = localStorage.getItem("pagamentoAprovado");

if (pagamentoAprovado === "true") {
  statusEl.innerText = "✅ Pagamento aprovado!";
} else if (paymentId) {
  statusEl.innerText = "⏳ Aguardando pagamento...";
  iniciarPolling();
} else {
  criarPix();
}
