// ============================
// PRODUTOS TESTE
// ============================
const produtos = [
  { id: 1, nome: "Banana", preco: 0.02 },
  { id: 2, nome: "Maçã", preco: 0.03 },
  { id: 3, nome: "Laranja", preco: 0.05 },
  { id: 4, nome: "Uva", preco: 0.08 },
  { id: 5, nome: "Abacaxi", preco: 0.10 }
];

let produtoSelecionado = null;
let quantidadeSelecionada = 1;
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// ============================
// RENDER PRODUTOS
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productsGrid");

  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-xl shadow";

    div.innerHTML = `
      <h3 class="font-bold">${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button class="mt-2 bg-green-600 text-white w-full py-2 rounded"
        onclick="abrirModalQuantidade(${produto.id})">
        Adicionar
      </button>
    `;

    grid.appendChild(div);
  });
});

// ============================
// MODAL
// ============================
function abrirModalQuantidade(id) {
  produtoSelecionado = produtos.find(p => p.id === id);
  quantidadeSelecionada = 1;

  document.getElementById("productNameModal").innerText = produtoSelecionado.nome;
  document.getElementById("productPriceModal").innerText =
    `R$ ${produtoSelecionado.preco.toFixed(2)}`;
  document.getElementById("quantityInput").value = 1;

  document.getElementById("quantityModal").classList.remove("hidden");
}

function fecharModalQuantidade() {
  document.getElementById("quantityModal").classList.add("hidden");
}

// ============================
// QUANTIDADE
// ============================
function aumentarQuantidade() {
  quantidadeSelecionada++;
  atualizarQuantidade();
}

function diminuirQuantidade() {
  if (quantidadeSelecionada > 1) {
    quantidadeSelecionada--;
    atualizarQuantidade();
  }
}

function quantidadeManual() {
  const v = Number(document.getElementById("quantityInput").value);
  quantidadeSelecionada = v >= 1 ? v : 1;
  atualizarQuantidade();
}

function atualizarQuantidade() {
  document.getElementById("quantityInput").value = quantidadeSelecionada;
}

// ============================
// CONFIRMAR
// ============================
function confirmarQuantidade() {
  const existente = carrinho.find(p => p.id === produtoSelecionado.id);

  if (existente) {
    existente.qtd += quantidadeSelecionada;
  } else {
    carrinho.push({
      ...produtoSelecionado,
      qtd: quantidadeSelecionada
    });
  }

  salvarTotal();
  fecharModalQuantidade();
}

function salvarTotal() {
  let total = 0;
  carrinho.forEach(p => total += p.preco * p.qtd);
  localStorage.setItem("totalCompra", total.toFixed(2));
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ============================
// FINALIZAR
// ============================
function finalizarCompra() {
  const total = Number(localStorage.getItem("totalCompra"));
  if (!total || total <= 0) {
    alert("Carrinho vazio");
    return;
  }
  window.location.href = "payment.html";
}
