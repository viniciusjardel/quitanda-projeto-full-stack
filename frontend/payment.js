// ===== CONFIGURAÇÃO PIX =====
const API_BASE = 'http://localhost:3000'; // Alterar para URL do backend em produção

// Estado do pagamento
let currentPaymentState = {
    paymentId: null,
    status: null,
    pollingInterval: null
};

// ===== FUNÇÕES DE PAGAMENTO =====

// Abrir modal de entrega
window.openDeliveryModal = function() {
    console.log('🚚 Abrindo modal de entrega');
    const modal = document.getElementById('deliveryModal');
    const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (!modal) {
        console.error('❌ Modal de entrega não encontrado!');
        return;
    }
    
    document.getElementById('cartModal').classList.add('hidden');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Exibir total inicial
    document.getElementById('cartTotal').textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
};

// Fechar modal de entrega
window.closeDeliveryModal = function() {
    const modal = document.getElementById('deliveryModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

// Selecionar tipo de entrega
window.selectDeliveryType = function(type) {
    console.log(`📦 Tipo de entrega selecionado: ${type}`);
    
    const localBtn = document.getElementById('localBtn');
    const deliveryBtn = document.getElementById('deliveryBtn');
    const deliveryForm = document.getElementById('deliveryForm');
    const deliveryTotal = document.getElementById('deliveryTotal');
    const confirmBtn = document.getElementById('confirmDeliveryBtn');
    
    if (type === 'local') {
        localBtn.classList.add('border-green-500', 'bg-green-50');
        deliveryBtn.classList.remove('border-blue-500', 'bg-blue-50');
        deliveryForm.classList.add('hidden');
        deliveryTotal.classList.add('hidden');
    } else {
        localBtn.classList.remove('border-green-500', 'bg-green-50');
        deliveryBtn.classList.add('border-blue-500', 'bg-blue-50');
        deliveryForm.classList.remove('hidden');
        deliveryTotal.classList.remove('hidden');
        updateDeliveryTotal();
    }
    
    confirmBtn.classList.remove('hidden');
    confirmBtn.classList.add('block');
    
    window.selectedDeliveryType = type;
};

// Atualizar total com delivery
function updateDeliveryTotal() {
    const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 3.00;
    const total = cartTotal + deliveryFee;
    
    document.getElementById('deliveryTotalValue').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('deliveryTotalBreakdown').textContent = 
        `Subtotal: R$ ${cartTotal.toFixed(2).replace('.', ',')} + Taxa: R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
}

// Confirmar entrega e ir para pagamento
window.confirmDelivery = function() {
    console.log('✅ Confirmando entrega e indo para pagamento');
    
    // Validações
    if (!window.selectedDeliveryType) {
        alert('⚠️ Selecione um tipo de entrega');
        return;
    }
    
    if (window.selectedDeliveryType === 'delivery') {
        const name = document.getElementById('deliveryName').value.trim();
        const phone = document.getElementById('deliveryPhone').value.trim();
        const address = document.getElementById('deliveryAddress').value.trim();
        
        if (!name || !phone || !address) {
            alert('⚠️ Preencha todos os dados de entrega');
            return;
        }
        
        // Armazenar dados de entrega
        window.deliveryData = { name, phone, address };
    }
    
    closeDeliveryModal();
    openPixModal();
};

// Abrir modal PIX
window.openPixModal = async function() {
    console.log('💳 Abrindo modal PIX');
    
    const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = window.selectedDeliveryType === 'delivery' ? cartTotal + 3.00 : cartTotal;
    
    const modal = document.getElementById('pixModal');
    if (!modal) {
        console.error('❌ Modal PIX não encontrado!');
        return;
    }
    
    // Mostrar modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Exibir valor a pagar
    document.getElementById('pixTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Gerar PIX via API
    await generatePix(total);
};

// Fechar modal PIX
window.closePixModal = function() {
    const modal = document.getElementById('pixModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    
    // Limpar estado
    if (currentPaymentState.pollingInterval) {
        clearInterval(currentPaymentState.pollingInterval);
    }
};

// Gerar PIX
async function generatePix(amount) {
    try {
        console.log(`💰 Gerando PIX de R$ ${amount.toFixed(2)}`);
        
        const response = await fetch(`${API_BASE}/pix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valor: amount,
                descricao: 'Compra Hortifruti Vila Natal'
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro na API');
        }
        
        const data = await response.json();
        
        console.log('✅ PIX gerado com sucesso:', data);
        
        // Exibir QR Code e código PIX
        document.getElementById('pixKey').textContent = data.qr_code || 'Código PIX indisponível';
        
        // Se houver QR Code em base64, mostrar como imagem
        if (data.qr_code_base64) {
            const pixContainer = document.getElementById('pixKey').parentElement;
            pixContainer.innerHTML = `
                <img src="data:image/png;base64,${data.qr_code_base64}" 
                     alt="QR Code PIX" 
                     style="width: 200px; height: 200px; margin: 0 auto; display: block;">
                <p style="text-align: center; margin-top: 10px; font-size: 12px; color: #666;">
                    ${data.qr_code}
                </p>
            `;
        }
        
        // Salvar ID do pagamento
        currentPaymentState.paymentId = data.id;
        currentPaymentState.status = data.status;
        
        // Iniciar polling
        startPaymentPolling(data.id);
        
        // Salvar no localStorage
        localStorage.setItem('lastPaymentId', data.id);
        localStorage.setItem('lastPaymentData', JSON.stringify(data));
        
    } catch (error) {
        console.error('❌ Erro ao gerar PIX:', error);
        alert('❌ Erro ao gerar PIX. Tente novamente.');
        closePixModal();
    }
}

// Iniciar polling de status
function startPaymentPolling(paymentId) {
    console.log(`📊 Iniciando polling para pagamento ${paymentId}`);
    
    // Limpar interval anterior se existir
    if (currentPaymentState.pollingInterval) {
        clearInterval(currentPaymentState.pollingInterval);
    }
    
    // Verificar a cada 2 segundos
    currentPaymentState.pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/status/${paymentId}`);
            const data = await response.json();
            
            console.log(`📊 Status do pagamento: ${data.status}`);
            
            if (data.status === 'approved') {
                console.log('✅ PAGAMENTO CONFIRMADO!');
                clearInterval(currentPaymentState.pollingInterval);
                handlePaymentSuccess(paymentId, data);
            }
        } catch (error) {
            console.error('❌ Erro ao consultar status:', error);
        }
    }, 2000);
}

// Manipular sucesso do pagamento
function handlePaymentSuccess(paymentId, paymentData) {
    closePixModal();
    
    // Exibir notificação de sucesso
    showNotification('✅ Pagamento confirmado! Seu pedido foi recebido.');
    
    // Limpar carrinho
    window.cart = [];
    updateCartBadge();
    
    // Salvar pedido
    const order = {
        id: paymentId,
        timestamp: new Date().toISOString(),
        items: window.cart,
        deliveryType: window.selectedDeliveryType,
        deliveryData: window.deliveryData,
        total: paymentData.valor,
        status: 'paid'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// Copiar PIX
window.copyPix = function() {
    const pixKey = document.getElementById('pixKey');
    if (!pixKey) return;
    
    // Se for imagem, copiar o texto abaixo
    const text = pixKey.textContent || pixKey.innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('📋 PIX copiado!');
        });
    } else {
        // Fallback para browsers antigos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('📋 PIX copiado!');
    }
};

// Enviar para WhatsApp
window.sendToWhatsApp = function() {
    const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = window.selectedDeliveryType === 'delivery' ? cartTotal + 3.00 : cartTotal;
    
    let message = 'Olá! Gostaria de confirmar um pedido:\n\n';
    
    // Adicionar itens
    message += '*ITENS:*\n';
    window.cart.forEach(item => {
        message += `- ${item.name} x${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Adicionar tipo de entrega
    message += `\n*ENTREGA:* ${window.selectedDeliveryType === 'delivery' ? 'Delivery (+ R$ 3,00)' : 'Retirar no local'}\n`;
    
    if (window.deliveryData) {
        message += `*Nome:* ${window.deliveryData.name}\n`;
        message += `*Telefone:* ${window.deliveryData.phone}\n`;
        message += `*Endereço:* ${window.deliveryData.address}\n`;
    }
    
    // Adicionar total
    message += `\n*TOTAL:* R$ ${total.toFixed(2)}\n`;
    message += `\nPagamento confirmado via PIX ✅`;
    
    // Número do WhatsApp
    const whatsappNumber = '5581971028677'; // Alterar conforme necessário
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
};

// ===== FUNÇÕES AUXILIARES =====

// Atualizar badge do carrinho
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = window.cart.length;
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Mostrar notificação
function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    document.getElementById('notificationMessage').textContent = message;
    toast.classList.remove('hidden', 'notification-hide');
    
    setTimeout(() => {
        toast.classList.add('notification-hide');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 1000);
    }, 3000);
}

// ===== INTEGRAÇÃO COM CARRINHO =====

// Garantir que cart existe
if (!window.cart) {
    window.cart = [];
}

// Função para adicionar ao carrinho (se não existir)
if (!window.addToCart) {
    window.addToCart = function() {
        console.log('➕ Adicionando ao carrinho:', window.currentProduct);
        
        if (!window.currentProduct) return;
        
        const quantity = parseInt(document.getElementById('quantityInput').value) || window.quantity || 0;
        
        if (quantity <= 0) {
            alert('⚠️ Informe uma quantidade válida');
            return;
        }
        
        const item = {
            ...window.currentProduct,
            quantity: quantity,
            cartItemId: window.currentProduct.id + '_' + Date.now()
        };
        
        window.cart.push(item);
        updateCartBadge();
        showNotification(`✅ ${window.currentProduct.name} adicionado ao carrinho!`);
        
        // Fechar modais
        window.closeQuantityModal?.();
        
        localStorage.setItem('cart', JSON.stringify(window.cart));
    };
}

// Exibir carrinho
if (!window.toggleCart) {
    window.toggleCart = function() {
        const modal = document.getElementById('cartModal');
        if (!modal) return;
        
        if (modal.classList.contains('hidden')) {
            renderCart();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } else {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };
}

// Renderizar carrinho
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (window.cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 py-8">Carrinho vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = window.cart.map((item, index) => `
        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
            <div class="flex-1">
                <h4 class="font-bold text-gray-800">${item.name}</h4>
                <p class="text-sm text-gray-500">${item.quantity} x R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-green-600">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="window.removeFromCart(${index})" class="text-red-500 hover:text-red-700 text-sm mt-1">
                    ✕ Remover
                </button>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Remover do carrinho
window.removeFromCart = function(index) {
    window.cart.splice(index, 1);
    updateCartBadge();
    renderCart();
    localStorage.setItem('cart', JSON.stringify(window.cart));
    showNotification('🗑️ Produto removido do carrinho');
};

console.log('✅ payment.js carregado com sucesso');
