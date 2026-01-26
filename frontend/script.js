// ===== INICIALIZAÇÃO DO PAINEL ADMIN =====
console.log('%c🚀 ADMIN PANEL LOADED', 'color: green; font-weight: bold; font-size: 16px;');

let products = [];
let editingProductId = null;

// ===== PRODUTOS DE EXEMPLO (Sincronizados com o site do cliente) =====
const SAMPLE_PRODUCTS = [
    {
        id: 'sample_1',
        name: '🍎 Maçã Fuji',
        description: 'Maçã fresca e crocante',
        price: 5.99,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
        color: '#ef4444'
    },
    {
        id: 'sample_2',
        name: '🍌 Banana Prata',
        description: 'Banana madura e doce',
        price: 3.49,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
        color: '#f59e0b'
    },
    {
        id: 'sample_3',
        name: '🥕 Cenoura Orgânica',
        description: 'Cenoura fresca e orgânica',
        price: 2.99,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
        color: '#f97316'
    },
    {
        id: 'sample_4',
        name: '🍅 Tomate Italiano',
        description: 'Tomate vermelho maduro',
        price: 4.49,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1546470427-e26264be0b1a?w=400&h=300&fit=crop',
        color: '#dc2626'
    },
    {
        id: 'sample_5',
        name: '🥬 Alface Crespa',
        description: 'Alface fresca do dia',
        price: 2.49,
        unit: 'un',
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop',
        color: '#10b981'
    },
    {
        id: 'sample_6',
        name: '🥔 Batata Inglesa',
        description: 'Batata de primeira qualidade',
        price: 3.99,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        color: '#92400e'
    }
];

// Load data
function loadData() {
    console.log('%c📂 CARREGANDO DADOS...', 'color: blue; font-weight: bold;');
    const stored = localStorage.getItem('hortifruti_products');
    console.log('%cProdutos no localStorage:', 'color: purple;', stored ? `${stored.length} caracteres` : 'VAZIO');
    
    if (stored) {
        try {
            products = JSON.parse(stored);
            console.log('%c✅ Produtos carregados do localStorage:', 'color: green;', products.length);
        } catch (e) {
            console.error('❌ Erro ao parsear localStorage:', e.message);
            console.log('%c📦 Usando produtos de exemplo', 'color: orange; font-weight: bold;');
            products = JSON.parse(JSON.stringify(SAMPLE_PRODUCTS)); // Deep copy
        }
    } else {
        // Se localStorage vazio, usar produtos de exemplo
        console.log('%c📦 localStorage vazio, usando produtos de exemplo', 'color: orange; font-weight: bold;');
        products = JSON.parse(JSON.stringify(SAMPLE_PRODUCTS)); // Deep copy
        saveProducts(); // Salvar os produtos de exemplo no localStorage
    }
    renderProducts();
    loadSettings();
    setupStorageListeners(); // Configurar listeners de sincronização
}

// Configurar listeners de sincronização entre abas
function setupStorageListeners() {
    console.log('%c📡 Configurando listeners de sincronização...', 'color: blue; font-weight: bold;');
    
    // Listener para mudanças de storage em outras abas/janelas
    window.addEventListener('storage', function(e) {
        if (e.key === 'hortifruti_products') {
            console.log('%c🔔 STORAGE ALTERADO EM OUTRA ABA!', 'color: green; font-weight: bold;');
            if (e.newValue) {
                try {
                    products = JSON.parse(e.newValue);
                    console.log('%c✅ Produtos recarregados de outra aba:', 'color: green;', products.length);
                    renderProducts();
                } catch (err) {
                    console.error('%c❌ Erro ao parsear dados de outra aba:', 'color: red;', err);
                }
            }
        }
    });
    
    // Listener para evento customizado de atualização
    window.addEventListener('hortifruti_products_updated', function(e) {
        console.log('%c🔄 Evento customizado recebido!', 'color: purple; font-weight: bold;');
        if (e.detail && e.detail.products) {
            products = e.detail.products;
            renderProducts();
        }
    });
    
    // Listener para postMessage
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'hortifruti_products_updated') {
            console.log('%c📨 PostMessage recebido!', 'color: purple; font-weight: bold;');
            if (e.data.products && e.data.source !== 'admin') {
                try {
                    products = e.data.products;
                    console.log('%c✅ Produtos atualizados via postMessage:', 'color: green;', products.length);
                    renderProducts();
                } catch (err) {
                    console.error('%c❌ Erro ao processar postMessage:', 'color: red;', err);
                }
            }
        }
    });
    
    console.log('%c✅ Listeners configurados com sucesso', 'color: green; font-weight: bold;');
}

// Save products com sincronização em tempo real
function saveProducts() {
    console.log('%c💾 SALVANDO PRODUTOS...', 'color: blue; font-weight: bold;');
    const json = JSON.stringify(products);
    const hash = btoa(json);
    
    // Validar se há dados para salvar
    if (!products || products.length === 0) {
        console.warn('%c⚠️ Nenhum produto para salvar', 'color: orange;');
        return false;
    }
    
    let saveSuccess = false;
    
    // Salvar em localStorage (principal)
    try {
        localStorage.setItem('hortifruti_products', json);
        localStorage.setItem('hortifruti_products_hash', hash);
        localStorage.setItem('hortifruti_timestamp', new Date().toISOString());
        console.log('%c✅ localStorage: SALVO com sucesso', 'color: green;');
        saveSuccess = true;
    } catch (e) {
        console.warn('%c⚠️ localStorage falhou:', 'color: orange;', e.message);
    }
    
    // Salvar também em sessionStorage (compatibilidade iOS)
    try {
        sessionStorage.setItem('hortifruti_products', json);
        sessionStorage.setItem('hortifruti_products_hash', hash);
        sessionStorage.setItem('hortifruti_timestamp', new Date().toISOString());
        console.log('%c✅ sessionStorage: SALVO com sucesso', 'color: green;');
    } catch (e) {
        console.warn('%c⚠️ sessionStorage falhou:', 'color: orange;', e.message);
    }
    
    // Salvar em window.name (compatibilidade iOS entre abas)
    try {
        const storageData = { products: products, timestamp: new Date().toISOString(), hash: hash };
        window.name = 'hortifruti_' + btoa(JSON.stringify(storageData));
        console.log('%c✅ window.name: SALVO com sucesso', 'color: green;');
    } catch (e) {
        console.warn('%c⚠️ window.name falhou:', 'color: orange;', e.message);
    }
    
    // Disparar evento customizado para sincronização local
    const event = new CustomEvent('hortifruti_products_updated', {
        detail: { products: products, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
    console.log('%c✅ CustomEvent: DISPARADO', 'color: green;');
    
    // Tentar notificar abas/janelas abertas via postMessage
    try {
        const message = { 
            type: 'hortifruti_products_updated', 
            products: products,
            timestamp: new Date().toISOString(),
            source: 'admin'
        };
        
        // Notificar janela pai (se aberta do admin)
        if (window.opener) {
            window.opener.postMessage(message, '*');
            console.log('%c✅ postMessage enviado para window.opener', 'color: green;');
        }
        
        // Notificar frames filhos
        if (window.frames && window.frames.length > 0) {
            window.frames.forEach((frame, index) => {
                try {
                    frame.postMessage(message, '*');
                    console.log(`%c✅ postMessage enviado para frame ${index}`, 'color: green;');
                } catch (e) {
                    // Ignorar erros de CORS
                }
            });
        }
    } catch (e) {
        console.warn('%c⚠️ postMessage falhou:', 'color: orange;', e.message);
    }
    
    console.log('%c✅ SALVOS COM SUCESSO!', 'color: green;', `${products.length} produtos, ${json.length} caracteres, hash: ${hash.substring(0, 8)}`);
    return saveSuccess;
}

// Render products list
function renderProducts() {
    const list = document.getElementById('productsList');
    const empty = document.getElementById('emptyProducts');
    
    if (products.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    list.innerHTML = products.map(p => `
        <div class="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
            <img src="${p.image}" alt="${p.name}" class="w-24 h-24 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-800">${p.name}</h4>
                ${p.description ? `<p class="text-sm text-gray-500">${p.description}</p>` : ''}
                <div class="flex items-center gap-4 mt-2">
                    <span class="text-xl font-bold text-green-600">R$ ${p.price.toFixed(2)}</span>
                    <span class="text-sm text-gray-600">${p.unit}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editProduct('${p.id}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    ✏️ Editar
                </button>
                <button onclick="deleteProduct('${p.id}')" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Open product modal
function openProductModal() {
    console.log('%c📋 Abrindo modal de novo produto', 'color: blue; font-weight: bold;');
    
    editingProductId = null;
    
    // Validar se todos os elementos existem
    const requiredElements = [
        'modalTitle', 'productId', 'productName', 'productDescription', 
        'productPrice', 'productUnit', 'productImage', 'productImageFile',
        'productImageData', 'productColor', 'imagePreview', 'productModal'
    ];
    
    let allExist = true;
    requiredElements.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.error(`  ❌ Elemento não encontrado: #${id}`);
            allExist = false;
        }
    });
    
    if (!allExist) {
        console.error('%c❌ ERRO: Alguns elementos estão faltando no HTML!', 'color: red; font-weight: bold;');
        alert('❌ Erro: Alguns elementos do formulário estão faltando. Recarregue a página.');
        return;
    }
    
    document.getElementById('modalTitle').textContent = 'Novo Produto';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productUnit').value = 'kg';
    document.getElementById('productImage').value = '';
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImageData').value = '';
    document.getElementById('productColor').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('productImage').disabled = false;
    document.getElementById('productImageFile').disabled = false;
    
    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('productModal').classList.add('flex');
    
    console.log('  ✅ Modal aberto com sucesso');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    document.getElementById('productModal').classList.remove('flex');
}

// Edit product
function editProduct(id) {
    console.log('%c✏️ Editando produto:', 'color: blue; font-weight: bold;', id);
    
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error('  ❌ Produto não encontrado com ID:', id);
        return;
    }
    
    // Validar se todos os elementos existem
    const requiredElements = [
        'modalTitle', 'productId', 'productName', 'productDescription', 
        'productPrice', 'productUnit', 'productImage', 'productImageFile',
        'productImageData', 'productColor', 'imagePreview', 'previewImg', 'productModal'
    ];
    
    let allExist = true;
    requiredElements.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.error(`  ❌ Elemento não encontrado: #${id}`);
            allExist = false;
        }
    });
    
    if (!allExist) {
        console.error('%c❌ ERRO: Alguns elementos estão faltando no HTML!', 'color: red; font-weight: bold;');
        alert('❌ Erro: Alguns elementos do formulário estão faltando. Recarregue a página.');
        return;
    }
    
    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Editar Produto';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImageData').value = '';
    document.getElementById('productColor').value = product.color || '';
    
    // Show image preview
    document.getElementById('imagePreview').classList.remove('hidden');
    document.getElementById('previewImg').src = product.image;
    document.getElementById('productImage').disabled = false;
    document.getElementById('productImageFile').disabled = false;
    
    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('productModal').classList.add('flex');
    
    console.log('  ✅ Produto carregado para edição:', product.name);
}

// Select color
function selectColor(color, element) {
    console.log('%c🎨 Selecionando cor:', 'color: purple; font-weight: bold;', color);
    
    const colorInput = document.getElementById('productColor');
    if (colorInput) {
        colorInput.value = color;
        console.log('  ✅ Cor armazenada:', color);
    } else {
        console.error('  ❌ Elemento #productColor não encontrado!');
    }
    
    if (element) {
        element.style.border = '3px solid #000';
        setTimeout(() => {
            element.style.border = 'none';
        }, 300);
    }
}

// Handle image input - file upload
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('productImageFile');
    const urlInput = document.getElementById('productImage');
    
    // File upload handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Disable URL input when file is selected
            urlInput.disabled = true;
            urlInput.value = '';
            
            // Read file and convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                document.getElementById('productImageData').value = base64;
                
                // Show preview
                document.getElementById('imagePreview').classList.remove('hidden');
                document.getElementById('previewImg').src = base64;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // URL input handler
    urlInput.addEventListener('input', (e) => {
        const url = e.target.value;
        
        if (url) {
            // Disable file input when URL is entered
            fileInput.disabled = true;
            fileInput.value = '';
            document.getElementById('productImageData').value = '';
            
            // Show preview
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('previewImg').src = url;
        } else {
            // Enable file input if URL is cleared
            fileInput.disabled = false;
        }
    });
    
    // File input clear handler
    fileInput.addEventListener('input', (e) => {
        if (!e.target.files.length) {
            urlInput.disabled = false;
        }
    });
});

// Save product
function saveProduct(e) {
    e.preventDefault();
    
    console.log('%c💾 TENTANDO SALVAR PRODUTO...', 'color: blue; font-weight: bold;');
    
    const imageData = document.getElementById('productImageData').value;
    const imageUrl = document.getElementById('productImage').value;
    const finalImage = imageData || imageUrl;
    
    console.log('  imageData:', imageData ? `✅ ${imageData.length} caracteres` : '❌ vazio');
    console.log('  imageUrl:', imageUrl ? `✅ ${imageUrl}` : '❌ vazio');
    console.log('  finalImage:', finalImage ? `✅ OK` : '❌ VAZIO!');
    
    if (!finalImage) {
        console.error('%c❌ ERRO: Sem imagem!', 'color: red; font-weight: bold;');
        alert('⚠️ Por favor, adicione uma imagem (arquivo ou URL)');
        return;
    }
    
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    
    if (!productName) {
        console.error('%c❌ ERRO: Nome vazio!', 'color: red; font-weight: bold;');
        alert('⚠️ Por favor, preencha o nome do produto');
        return;
    }
    
    if (!productPrice || productPrice <= 0) {
        console.error('%c❌ ERRO: Preço inválido!', 'color: red; font-weight: bold;');
        alert('⚠️ Por favor, preencha um preço válido');
        return;
    }
    
    const productData = {
        id: editingProductId || 'prod_' + Date.now(),
        name: productName,
        description: document.getElementById('productDescription').value,
        price: productPrice,
        unit: document.getElementById('productUnit').value,
        image: finalImage,
        color: document.getElementById('productColor').value || null
    };
    
    console.log('  Dados do produto:', productData);
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        products[index] = productData;
        console.log('  ✏️ Produto editado: índice', index);
    } else {
        products.push(productData);
        console.log('  ✅ Produto adicionado ao array');
    }
    
    saveProducts();
    renderProducts();
    closeProductModal();
    alert('✅ Produto salvo com sucesso!');
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProducts();
    alert('✅ Produto excluído com sucesso!');
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('hortifruti_settings') || '{}');
    document.getElementById('pixKeyInput').value = settings.pixKey || '';
    document.getElementById('whatsappInput').value = settings.whatsapp || '5581989828095';
    document.getElementById('addressInput').value = settings.address || 'Av. General Manoel Rabelo, 1725 - Jabotão';
    document.getElementById('openingInput').value = settings.opening || '08:00';
    document.getElementById('closingInput').value = settings.closing || '19:00';
}

// Save settings
function saveSettings(e) {
    e.preventDefault();
    
    const settings = {
        pixKey: document.getElementById('pixKeyInput').value,
        whatsapp: document.getElementById('whatsappInput').value,
        address: document.getElementById('addressInput').value,
        opening: document.getElementById('openingInput').value,
        closing: document.getElementById('closingInput').value
    };
    
    localStorage.setItem('hortifruti_settings', JSON.stringify(settings));
    alert('✅ Configurações salvas com sucesso!');
}

// Clear all data
function clearAllData() {
    if (!confirm('⚠️ ATENÇÃO! Isso vai apagar TODOS os produtos e configurações. Tem certeza?')) return;
    if (!confirm('Esta ação não pode ser desfeita. Confirma novamente?')) return;
    
    localStorage.removeItem('hortifruti_products');
    localStorage.removeItem('hortifruti_settings');
    products = [];
    renderProducts();
    loadSettings();
    alert('✅ Todos os dados foram apagados!');
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active state from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    
    // Show selected tab
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // Add active state to button
    const btn = document.getElementById(`tab-${tabName}`);
    btn.classList.add('border-purple-600', 'text-purple-600');
    btn.classList.remove('border-transparent', 'text-gray-600');
}

// Initialize
console.log('%c🔄 INICIALIZANDO PAINEL...', 'color: orange; font-weight: bold;');
loadData();
console.log('%c✨ PAINEL PRONTO!', 'color: green; font-weight: bold; font-size: 14px;');
console.log('%c═══════════════════════════', 'color: green;');
console.log('%c📊 TOTAL DE PRODUTOS DISPONÍVEIS:', 'color: blue; font-weight: bold;', products.length);
products.forEach((p, i) => {
    console.log(`  [${i+1}] ${p.name} - R$ ${p.price} (${p.unit})`);
});
console.log('%c═══════════════════════════', 'color: green;');
