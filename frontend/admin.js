const API_URL = "https://quitanda-projeto-full-stack-1.onrender.com";

/* =======================
   TABS
======================= */
function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("border-purple-600", "text-purple-600");
    btn.classList.add("text-gray-600");
  });

  document.getElementById(`content-${tab}`).classList.remove("hidden");
  document.getElementById(`tab-${tab}`).classList.add("border-purple-600", "text-purple-600");
}

/* =======================
   PRODUTOS
======================= */
let products = [];
let editingId = null;

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  products = await res.json();

  const list = document.getElementById("productsList");
  const empty = document.getElementById("emptyProducts");

  list.innerHTML = "";

  if (products.length === 0) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-4 border rounded-lg";

    div.innerHTML = `
      <div class="flex gap-4 items-center">
        <img src="${p.image}" class="w-16 h-16 rounded object-cover">
        <div>
          <p class="font-bold">${p.name}</p>
          <p class="text-sm text-gray-500">R$ ${p.price.toFixed(2)} / ${p.unit}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editProduct('${p.id}')" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
        <button onclick="deleteProduct('${p.id}')" class="bg-red-500 text-white px-4 py-2 rounded">Excluir</button>
      </div>
    `;

    list.appendChild(div);
  });
}

function openProductModal() {
  editingId = null;
  document.getElementById("modalTitle").innerText = "Novo Produto";
  document.getElementById("productModal").classList.remove("hidden");
  document.querySelector("#productModal form").reset();
}

function closeProductModal() {
  document.getElementById("productModal").classList.add("hidden");
}

async function saveProduct(e) {
  e.preventDefault();

  const product = {
    name: productName.value,
    description: productDescription.value,
    price: Number(productPrice.value),
    unit: productUnit.value,
    image: productImage.value || previewImg.src,
    color: productColor.value
  };

  const method = editingId ? "PUT" : "POST";
  const url = editingId
    ? `${API_URL}/products/${editingId}`
    : `${API_URL}/products`;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  closeProductModal();
  loadProducts();
}

function editProduct(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  editingId = id;
  modalTitle.innerText = "Editar Produto";

  productName.value = p.name;
  productDescription.value = p.description;
  productPrice.value = p.price;
  productUnit.value = p.unit;
  productImage.value = p.image;

  previewImg.src = p.image;
  imagePreview.classList.remove("hidden");

  openProductModal();
}

async function deleteProduct(id) {
  if (!confirm("Excluir produto?")) return;
  await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  loadProducts();
}

/* =======================
   CONFIGURAÇÕES
======================= */
async function loadSettings() {
  const res = await fetch(`${API_URL}/settings`);
  const s = await res.json();

  pixKeyInput.value = s.pixKey || "";
  whatsappInput.value = s.whatsapp || "";
  addressInput.value = s.address || "";
  openingInput.value = s.opening || "08:00";
  closingInput.value = s.closing || "19:00";
}

async function saveSettings(e) {
  e.preventDefault();

  await fetch(`${API_URL}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pixKey: pixKeyInput.value,
      whatsapp: whatsappInput.value,
      address: addressInput.value,
      opening: openingInput.value,
      closing: closingInput.value
    })
  });

  alert("Configurações salvas!");
}

async function clearAllData() {
  if (!confirm("Isso apagará tudo. Continuar?")) return;
  await fetch(`${API_URL}/reset`, { method: "DELETE" });
  loadProducts();
}

/* =======================
   INIT
======================= */
loadProducts();
loadSettings();
