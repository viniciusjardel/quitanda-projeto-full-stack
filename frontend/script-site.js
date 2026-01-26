// frontend/script-site.js

const BACKEND_URL = "https://quitanda-projeto-full-stack-1.onrender.com";

let produtos = [
  { id: 1, nome: "Banana", preco: 5 },
  { id: 2, nome: "Maçã", preco: 7 },
  { id: 3, nome: "Laranja", preco: 4 }
];

let carrinho = [];
let produtoSelecionado = null;
let quantidadeAtual = 1;

// Renderiza produtos
function renderizarProdutos() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-xl shadow cursor-pointer";
    card.onclick = () => abrirModalQuantidade(produto);

    card.innerHTML = `
      <h2 class="font-bold text-lg">${produto.nome}</h2>
      <p class="text-gray-600">R$ ${produto.preco.toFixed(2)}</p>
    `;

    grid.appendChild(card);
  });
}

// Modal quantidade
function abrirModalQuantidade(produto) {
  produtoSelecionado = produto;
  quantidadeAtual = 1;

  document.getElementById("productNameModal").innerText = produto.nome;
  document.getElementById("productPriceModal").innerText =
    `R$ ${produto.preco.toFixed(2)}`;

  document.getElementById("quantityInput").value = 1;
  document.getElementById("quantityModal").classList.remove("hidden");
  document.getElementById("quantityModal").classList.add("flex");
}

function fecharModalQuantidade() {
  document.getElementById("quantityModal").classList.add("hidden");
}

function aumentarQuantidade() {
  quantidadeAtual++;
  document.getElementById("quantityInput").value = quantidadeAtual;
}

function diminuirQuantidade() {
  if (quantidadeAtual > 1) {
    quantidadeAtual--;
    document.getElementById("quantityInput").value = quantidadeAtual;
  }
}

function quantidadeManual() {
  quantidadeAtual = parseInt(document.getElementById("quantityInput").value) || 1;
}

// Confirma produto no carrinho
function confirmarQuantidade() {
  carrinho.push({
    ...produtoSelecionado,
    quantidade: quantidadeAtual
  });

  fecharModalQuantidade();
  alert("Produto adicionado ao carrinho 🛒");
}

// FINALIZAR COMPRA → CRIA PAGAMENTO NO BACKEND
async function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  try {
    const response = await fetch(`${BACKEND_URL}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: carrinho,
        total
      })
    });

    const data = await response.json();

    // Salva paymentId para consulta
    localStorage.setItem("currentPaymentId", data.paymentId);

    // Mostra Pix
    showPix(data.qrCodeBase64);

  } catch (err) {
    console.error(err);
    alert("Erro ao criar pagamento");
  }
}

renderizarProdutos();
