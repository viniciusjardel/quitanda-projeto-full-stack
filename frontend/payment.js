// frontend/payment.js

const BACKEND_URL = "https://quitanda-projeto-full-stack-1.onrender.com";

function showPix(qrBase64) {
  const container = document.getElementById("pix-container");

  container.innerHTML = `
    <div class="bg-white p-6 rounded-xl shadow mt-6 text-center">
      <h2 class="text-xl font-bold mb-4">Pagamento via Pix</h2>
      <img class="mx-auto mb-4" src="data:image/png;base64,${qrBase64}" />
      <p class="text-gray-600">Aguardando pagamento...</p>
    </div>
  `;

  startPaymentCheck();
}

function startPaymentCheck() {
  const paymentId = localStorage.getItem("currentPaymentId");
  if (!paymentId) return;

  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/order/${paymentId}`
      );

      const data = await response.json();

      if (data.status === "approved") {
        clearInterval(interval);
        localStorage.removeItem("currentPaymentId");

        alert("✅ Pagamento aprovado!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Erro ao consultar pagamento", err);
    }
  }, 5000);
}
