// ===== EXECUÇÃO IMEDIATA - IIFE =====
(function() {
    'use strict';
    
    // Variáveis globais
    window.products = [];
    window.cart = [];
    window.currentProduct = null;
    window.quantity = 0;
    
    // ===== CONFIGURAÇÃO DE HORÁRIO =====
    const STORE_HOURS = {
        openTime: 8,      // 08:00
        closeTime: 19,    // 19:00
        daysOpen: [1, 2, 3, 4, 5, 6, 0]  // SEG-DOM (0=DOM, 1=SEG, ..., 6=SAB)
    };
    
    // Função para verificar se está aberto
    function isStoreOpen() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        
        // Verificar se é um dia de funcionamento
        if (!STORE_HOURS.daysOpen.includes(currentDay)) {
            return false;
        }
        
        // Verificar horário
        return currentHour >= STORE_HOURS.openTime && currentHour < STORE_HOURS.closeTime;
    }
    
    // Função para atualizar status
    function updateStoreStatus() {
        const statusElement = document.getElementById('storeStatus');
        if (!statusElement) return;
        
        const isOpen = isStoreOpen();
        
        statusElement.classList.remove('status-open', 'status-closed');
        
        if (isOpen) {
            statusElement.classList.add('status-open');
            statusElement.innerHTML = '<span class="status-dot"></span><span>✓ Aberto agora</span>';
        } else {
            statusElement.classList.add('status-closed');
            const now = new Date();
            const nextOpenHour = STORE_HOURS.openTime;
            statusElement.innerHTML = `<span class="status-dot"></span><span>✗ Fechado até ${nextOpenHour}:00</span>`;
        }
    }
    
    // ===== FORÇAR PRODUTOS DE EXEMPLO IMEDIATAMENTE =====
    const SAMPLE_PRODUCTS = [
        {
            id: 'sample_old_1',
            name: '🍎 Maçã Fuji',
            description: 'Maçã fresca e crocante',
            price: 5.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWElQzMlQTclQzMlQTNzfGVufDB8fDB8fHww',
            color: '#ef4444'
        },
        {
            id: 'sample_maca_verde',
            name: '🟢 Maçã Verde',
            description: 'Maçã verde fresca e refrescante',
            price: 5.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJw5-aujlZF0wUPdfZclO_mNtzgIJvrAv1_Q&s',
            color: '#22c55e'
        },
        {
            id: 'sample_old_3',
            name: '🥕 Cenoura Orgânica',
            description: 'Cenoura fresca e orgânica',
            price: 2.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
            color: '#f97316'
        },
        {
            id: 'sample_old_4',
            name: '🍅 Tomate Italiano',
            description: 'Tomate vermelho maduro',
            price: 4.49,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1562695530-ca03c4b98623?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRvbWF0ZXxlbnwwfHwwfHx8MA%3D%3D',
            color: '#dc2626'
        },
        {
            id: 'sample_old_5',
            name: '🥬 Alface Crespa',
            description: 'Alface fresca do dia',
            price: 2.49,
            unit: 'un',
            image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop',
            color: '#10b981'
        },
        {
            id: 'sample_old_6',
            name: '🥔 Batata Inglesa',
            description: 'Batata de primeira qualidade',
            price: 3.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
            color: '#92400e'
        },
        {
            id: 'sample_1',
            name: '🫑 Pimentão',
            description: 'Pimentão fresco e vibrante',
            price: 1.99,
            unit: 'un',
            image: 'https://images.unsplash.com/photo-1622376242797-538aa64a9d38?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGltZW50YW8lMjB2ZXJkZSUyMHVuaWRhZGV8ZW58MHx8MHx8fDA%3D',
            color: '#22c55e'
        },
        {
            id: 'sample_2',
            name: '🌱 Chuchu',
            description: 'Chuchu fresco e crocante',
            price: 1.99,
            unit: 'un',
            image: 'https://plus.unsplash.com/premium_photo-1757716104926-cd2987d01ec3?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2h1Y2h1fGVufDB8fDB8fHww',
            color: '#84cc16'
        },
        {
            id: 'sample_3',
            name: '🌿 Coentro',
            description: 'Coentro fresco e aromático',
            price: 1.99,
            unit: 'un',
            image: 'https://images.unsplash.com/photo-1535189487909-a262ad10c165?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29lbnRyb3xlbnwwfHwwfHx8MA%3D%3D',
            color: '#10b981'
        },
        {
            id: 'sample_4',
            name: '🍌 Banana Prata',
            description: 'Banana madura, doce e cremosa',
            price: 5.99,
            unit: 'palma',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6uzihoUPkUVS0wwCnataCcs7SFuzWMNjimA&s',
            color: '#f59e0b'
        },
        {
            id: 'sample_5',
            name: '🥥 Coco Verde',
            description: 'Coco verde com água refrescante',
            price: 4.99,
            unit: 'un',
            image: 'https://redemix.vteximg.com.br/arquivos/ids/205942-1000-1000/628.jpg?v=638350587304530000',
            color: '#8b4513'
        },
        {
            id: 'sample_6',
            name: '🥥 Coco Ralado',
            description: 'Coco ralado fresco e saboroso',
            price: 5.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://cdn.awsli.com.br/600x450/2216/2216236/produto/150441743ce70ea5bcb.jpg',
            color: '#a16207'
        },
        {
            id: 'sample_7',
            name: '🥥 Água de Coco 1L',
            description: 'Água de coco natural e saudável',
            price: 14.99,
            unit: 'un',
            image: 'https://ibassets.com.br/ib.item.image.big/b-cb8e811d89c14a7c900f962c549b7a4b.jpeg',
            color: '#f59e0b'
        },
        {
            id: 'sample_8',
            name: '🥥 Água de Coco 500mL',
            description: 'Porção individual de água de coco',
            price: 6.99,
            unit: 'un',
            image: 'https://www.galaxcommerce.com.br/sistema/upload/4188/produtos/Agua-de-coco-garrafa-500ml_2024-09-23_09-49-46_0_49.png',
            color: '#f59e0b'
        },
        {
            id: 'sample_9',
            name: '🥔 Batata Doce',
            description: 'Batata doce nutritiva e saudável',
            price: 5.99,
            unit: 'kg',
            image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJUMzJUExfGVufDB8fDB8fHww',
            color: '#dc2626'
        },
        {
            id: 'sample_10',
            name: '🥒 Cará',
            description: 'Cará fresco e nutritivo',
            price: 7.99,
            unit: 'kg',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTex0jLkcT_0PTV3KJC47wBmZGNw9G6RINJxg&s',
            color: '#92400e'
        },
        {
            id: 'sample_11',
            name: '🌾 Macaxeira com Casca',
            description: 'Macaxeira fresca com casca',
            price: 4.99,
            unit: 'kg',
            image: 'https://organicosdafonte.com.br/wp-content/uploads/2022/01/MANDIOCA.jpg',
            color: '#92400e'
        },
        {
            id: 'sample_12',
            name: '🌾 Macaxeira sem Casca',
            description: 'Macaxeira descascada e pronta',
            price: 5.99,
            unit: 'kg',
            image: 'https://adaptive-images.uooucdn.com.br/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22251-ogxythkyut0/pv/41/c3/28/806c15f424b1f5699f8d1d6c7e.jpg',
            color: '#a16207'
        },
        {
            id: 'sample_13',
            name: '🍍 Abacaxi Grande',
            description: 'Abacaxi grande, suculento e doce',
            price: 7.99,
            unit: 'un',
            image: 'https://cdn.awsli.com.br/300x300/681/681419/produto/265322982/whatsapp-image-2024-10-05-at-09-24-50--2--f22ga3ka20.jpeg',
            color: '#f59e0b'
        },
        {
            id: 'sample_14',
            name: '🍍 Abacaxi Pequeno',
            description: 'Abacaxi pequeno, perfeito individual',
            price: 4.99,
            unit: 'un',
            image: 'https://urbanfarmipiranga.com.br/wp-content/uploads/2022/07/abacaxi-peq.jpg',
            color: '#f59e0b'
        },
        {
            id: 'sample_15',
            name: '🥑 Abacate',
            description: 'Abacate cremoso e nutritivo',
            price: 11.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://phygital-files.mercafacil.com/fazfeira/uploads/produto/abacate_8ce2e371-53de-4657-8223-fb48f4a32cd6.jpg',
            color: '#15803d'
        },
        {
            id: 'sample_16',
            name: '🍌 Banana Comprida (P)',
            description: 'Banana comprida tamanho pequeno',
            price: 1.99,
            unit: 'un',
            units: ['un', 'palma'],
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgrQW5f2NFVK1d9EQhFE7Tmehx9T-Mz0Ye7w&s',
            color: '#f59e0b'
        },
        {
            id: 'sample_17',
            name: '🍌 Banana Comprida (G)',
            description: 'Banana comprida tamanho grande',
            price: 2.99,
            unit: 'un',
            units: ['un', 'palma'],
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgrQW5f2NFVK1d9EQhFE7Tmehx9T-Mz0Ye7w&s',
            color: '#f59e0b'
        },
        {
            id: 'sample_kiwi',
            name: '🥝 Kiwi',
            description: 'Kiwi doce e refrescante',
            price: 29.90,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1585238341710-4b4e6416b573?w=300&auto=format&fit=crop&q=60',
            color: '#15803d'
        },
        {
            id: 'sample_pera',
            name: '🍐 Pera',
            description: 'Pera fresca e suculenta',
            price: 20.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.tcdn.com.br/img/img_prod/450860/muda_de_pera_d_agua_ou_europeia_1m_enxertada_676_1_20190611093602.jpg',
            color: '#a16207'
        },
        {
            id: 'sample_ameixa',
            name: '🫐 Ameixa Fresca',
            description: 'Ameixa doce e saudável',
            price: 24.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&auto=format&fit=crop&q=60',
            color: '#7c2d12'
        },
        {
            id: 'sample_uva_verde_sem',
            name: '🍇 Uva Verde s/ Sementes 400G',
            description: 'Uva verde sem sementes - Bandeja 400G',
            price: 11.99,
            unit: 'bandeja',
            image: 'https://naturalterra.vtexassets.com/arquivos/ids/172549/Uva-Verde-sem-Semente-Natural-Da-Terra-500g.jpg?v=638814438116570000',
            color: '#84cc16'
        },
        {
            id: 'sample_uva_verde_com',
            name: '🍇 Uva Verde c/ Sementes 400G',
            description: 'Uva verde com sementes - Bandeja 400G',
            price: 4.99,
            unit: 'bandeja',
            image: 'https://img.irroba.com.br/fit-in/600x600/filters:fill(transparent):quality(80)/shoeboxs/catalog/80039.png',
            color: '#84cc16'
        },
        {
            id: 'sample_uva_roxa_sem',
            name: '🍇 Uva Roxa s/ Sementes 400G',
            description: 'Uva roxa sem sementes - Bandeja 400G',
            price: 8.99,
            unit: 'bandeja',
            image: 'https://www.galaxcommerce.com.br/sistema/upload/4188/produtos/uva-sem-semente-vitoria-bandeja_2024-07-04_11-58-47_0_355.jpeg',
            color: '#7c3aed'
        },
        {
            id: 'sample_uva_roxa_com',
            name: '🍇 Uva Roxa c/ Sementes 400G',
            description: 'Uva roxa com sementes - Bandeja 400G',
            price: 5.99,
            unit: 'bandeja',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY_WEtpOWSxJvEq8-uLQpmQ5bOBDprjTgigA&s',
            color: '#7c3aed'
        },
        {
            id: 'sample_jambo',
            name: '🍎 Jambo',
            description: 'Jambo fresco - Bandeja com 5 unidades',
            price: 6.49,
            unit: 'bandeja',
            image: 'https://redemix.vteximg.com.br/arquivos/ids/205997-1000-1000/1275.jpg?v=638350587561600000',
            color: '#dc2626'
        },
        {
            id: 'sample_goiaba',
            name: '🍈 Goiaba',
            description: 'Goiaba fresca - Bandeja com 4 unidades',
            price: 5.99,
            unit: 'bandeja',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT-ITAX0eRHjSr6ZNVE_-4uZ_Y6OHncL60vw&s',
            color: '#22c55e'
        },
        {
            id: 'sample_acerola',
            name: '🍒 Acerola 500G',
            description: 'Acerola fresca - Bandeja 500G',
            price: 5.99,
            unit: 'bandeja',
            image: 'https://mambodelivery.vtexassets.com/arquivos/ids/155583/acerola-bandeja-400g.jpg?v=637883038843300000',
            color: '#dc2626'
        },
        {
            id: 'sample_melao',
            name: '🍈 Melão',
            description: 'Melão doce e refrescante',
            price: 6.49,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://www.proativaalimentos.com.br/image/cache/catalog/img_prod/melaoamarelo1_502698640_jpg_1024x1024[1]-300x300.jpg',
            color: '#f59e0b'
        },
        {
            id: 'sample_laranja_pera',
            name: '🍊 Laranja Pera',
            description: 'Laranja pera fresca e suculenta',
            price: 0.65,
            unit: 'un',
            image: 'https://www.proativaalimentos.com.br/image/cache/catalog/img_prod/Laranja-Pera[1]-1000x1000.jpg',
            color: '#f97316'
        },
        {
            id: 'sample_limao',
            name: '🍋 Limão',
            description: 'Limão - 7 unidades por R$ 2,00',
            price: 2.00,
            unit: 'un',
            image: 'https://www.okumacitrus.com.br/storage/conteudo/normal/137913520062877eae37f8a.jpg',
            color: '#facc15'
        },
        {
            id: 'sample_mamao_formosa',
            name: '🧡 Mamão Formosa',
            description: 'Mamão formosa doce e saudável',
            price: 5.99,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://media-agro.estadao.com.br/uploads/2022/02/1131.png',
            color: '#f97316'
        },
        {
            id: 'sample_mamao_hawaii',
            name: '🧡 Mamão Havaí',
            description: 'Mamão havaí doce e cremoso',
            price: 8.29,
            unit: 'kg',
            units: ['un', 'kg'],
            image: 'https://bretas.vtexassets.com/arquivos/ids/183597/6571bed0558925a4e8897e07.jpg?v=638375500373100000',
            color: '#f97316'
        }
    ];
    
    // ===== LOAD PRODUCTS =====
    function loadProducts() {
        addDebugMessage('🔍 Carregando produtos...', 'info');
        
        let loaded = false;
        
        // Estratégia 1: Tentar localStorage
        try {
            const stored = localStorage.getItem('hortifruti_products');
            if (stored && stored.trim() !== '' && stored.length > 10) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        window.products = parsed;
                        addDebugMessage(`✅ ${window.products.length} produtos carregados do localStorage`, 'success');
                        loaded = true;
                    }
                } catch (e) {
                    addDebugMessage(`⚠️ localStorage JSON inválido`, 'warning');
                }
            }
        } catch (e) {
            addDebugMessage(`⚠️ localStorage erro: ${e.message}`, 'warning');
        }
        
        // Estratégia 2: Tentar sessionStorage
        if (!loaded) {
            try {
                const storedSession = sessionStorage.getItem('hortifruti_products');
                if (storedSession && storedSession.trim() !== '' && storedSession.length > 10) {
                    try {
                        const parsed = JSON.parse(storedSession);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            window.products = parsed;
                            addDebugMessage(`✅ ${window.products.length} produtos carregados do sessionStorage`, 'success');
                            loaded = true;
                        }
                    } catch (e) {
                        addDebugMessage(`⚠️ sessionStorage JSON inválido`, 'warning');
                    }
                }
            } catch (e) {
                addDebugMessage(`⚠️ sessionStorage erro: ${e.message}`, 'warning');
            }
        }
        
        // Estratégia 3: Tentar window.name
        if (!loaded) {
            try {
                if (window.name && window.name.startsWith('hortifruti_')) {
                    const data = window.name.substring(11);
                    if (data && data.length > 10) {
                        try {
                            const parsed = JSON.parse(decodeURIComponent(data));
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                window.products = parsed;
                                addDebugMessage(`✅ ${window.products.length} produtos carregados de window.name`, 'success');
                                loaded = true;
                            }
                        } catch (e) {
                            addDebugMessage(`⚠️ window.name JSON inválido`, 'warning');
                        }
                    }
                }
            } catch (e) {
                // Ignorar
            }
        }
        
        // Fallback: usar produtos de exemplo
        if (!loaded) {
            addDebugMessage(`📦 Nenhum armazenamento tem dados, usando SAMPLE_PRODUCTS`, 'warning');
            window.products = SAMPLE_PRODUCTS;
            addDebugMessage(`✅ Carregados ${window.products.length} produtos de exemplo`, 'success');
        }
        
        // Configurar listeners de sincronização
        setupProductListeners();
        
        return true;
    }
    
    // ===== SETUP PRODUCT LISTENERS (SINCRONIZAÇÃO EM TEMPO REAL) =====
    function setupProductListeners() {
        console.log('%c📡 Configurando listeners de sincronização...', 'color: blue; font-weight: bold;');
        
        // Listener para mudanças de storage em outras abas/janelas
        window.addEventListener('storage', function(e) {
            if (e.key === 'hortifruti_products' && e.newValue) {
                console.log('%c🔔 STORAGE ALTERADO - SINCRONIZANDO!', 'color: green; font-weight: bold;');
                addDebugMessage('🔔 Produtos atualizados em outra aba!', 'info');
                try {
                    const newProducts = JSON.parse(e.newValue);
                    if (Array.isArray(newProducts) && newProducts.length > 0) {
                        window.products = newProducts;
                        console.log('%c✅ Produtos sincronizados:', 'color: green;', newProducts.length);
                        addDebugMessage(`✅ ${newProducts.length} produtos sincronizados do localStorage`, 'success');
                        renderProducts();
                    }
                } catch (err) {
                    console.error('%c❌ Erro ao sincronizar:', 'color: red;', err);
                    addDebugMessage(`❌ Erro na sincronização: ${err.message}`, 'error');
                }
            }
        });
        
        // Listener para evento customizado de atualização
        window.addEventListener('hortifruti_products_updated', function(e) {
            console.log('%c🔄 Evento customizado recebido!', 'color: purple; font-weight: bold;');
            addDebugMessage('🔄 Evento de atualização recebido!', 'info');
            if (e.detail && e.detail.products && Array.isArray(e.detail.products)) {
                window.products = e.detail.products;
                console.log('%c✅ Produtos atualizados via evento:', 'color: green;', window.products.length);
                addDebugMessage(`✅ ${window.products.length} produtos atualizados`, 'success');
                renderProducts();
            }
        });
        
        // Listener para postMessage (mensagens de outras janelas/abas)
        window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'hortifruti_products_updated') {
                console.log('%c📨 PostMessage recebido!', 'color: purple; font-weight: bold;');
                addDebugMessage('📨 Mensagem recebida do admin!', 'info');
                if (e.data.products && Array.isArray(e.data.products) && e.data.products.length > 0) {
                    try {
                        window.products = e.data.products;
                        console.log('%c✅ Produtos atualizados via postMessage:', 'color: green;', window.products.length);
                        addDebugMessage(`✅ ${window.products.length} produtos via postMessage`, 'success');
                        renderProducts();
                    } catch (err) {
                        console.error('%c❌ Erro ao processar postMessage:', 'color: red;', err);
                        addDebugMessage(`❌ Erro no postMessage: ${err.message}`, 'error');
                    }
                }
            }
        });
        
        console.log('%c✅ Listeners de sincronização configurados!', 'color: green; font-weight: bold;');
    }
    
    // ===== RENDER PRODUCTS =====
    function renderProducts() {
        console.log('🎨 Renderizando produtos...');
        
        const grid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) {
            console.error('❌ Grid não encontrado!');
            return;
        }
        
        console.log('  ✅ Grid encontrado');
        console.log('  📊 Total de produtos:', window.products.length);
        
        if (!window.products || window.products.length === 0) {
            console.log('⚠️ Nenhum produto para exibir');
            if (emptyState) emptyState.style.display = 'block';
            grid.style.display = 'none';
            return;
        }
        
        // Esconder empty state
        if (emptyState) emptyState.style.display = 'none';
        
        // Mostrar grid
        grid.style.display = 'grid';
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        
        // Gerar HTML
        const html = window.products.map((p) => {
            const btnStyle = p.color ? `background: ${p.color}` : 'background: linear-gradient(135deg, #7c3aed 0%, #10b981 100%)';
            // Para água de coco usar object-contain, para outros usar object-cover
            const imgClass = (p.id === 'sample_7' || p.id === 'sample_8') 
                ? 'w-full h-48 object-contain' 
                : 'w-full h-48 object-cover';
            // Escala para maçã verde ficar do mesmo tamanho da fuji
            const imgStyle = p.id === 'sample_maca_verde' ? 'transform: scale(1)' : '';
            
            // Gerar badges de unidades
            const units = p.units && p.units.length > 0 ? p.units : [p.unit];
            const unitBadges = units.map(unit => 
                `<span class="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-full">${unit.toUpperCase()}</span>`
            ).join('');
            
            return `
                <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden" style="opacity: 0; animation: fadeIn 0.5s forwards;">
                    <img src="${p.image}" 
                         alt="${p.name}" 
                         class="${imgClass}"
                         style="${imgStyle}"
                         loading="lazy">
                    <div class="p-4">
                        <h3 class="text-xl font-bold text-gray-800 mb-1">${p.name}</h3>
                        ${p.description ? `<p class="text-sm text-gray-500 mb-3">${p.description}</p>` : ''}
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-2xl font-bold text-green-600">R$ ${parseFloat(p.price).toFixed(2)}</span>
                            <div class="flex gap-1">${unitBadges}</div>
                        </div>
                        <button onclick="window.openQuantityModal('${p.id}')" 
                                class="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                                style="${btnStyle}">
                            <span class="text-xl">+</span> Adicionar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('  📝 HTML gerado, tamanho:', html.length, 'caracteres');
        console.log('  🔄 Atribuindo innerHTML...');
        
        grid.innerHTML = html;
        
        console.log('  ✅ innerHTML atribuído');
        console.log('  👶 Elementos filhos:', grid.children.length);
        
        // Adicionar animação CSS
        if (!document.getElementById('productAnimation')) {
            const style = document.createElement('style');
            style.id = 'productAnimation';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('✅ Produtos renderizados:', window.products.length);
    }
    
    // ===== SISTEMA DE CATEGORIAS E FILTROS =====
    window.currentCategory = 'all';
    window.currentSearchTerm = '';
    
    // Função para categorizar produtos
    function getProductCategory(product) {
        const name = (product.name || '').toLowerCase();
        
        // Frutas
        const frutas = ['maçã', 'banana', 'kiwi', 'pera', 'ameixa', 'uva', 'jambo', 'goiaba', 'acerola', 'melão', 'laranja', 'limão', 'mamão', 'coco verde', 'coco ralado'];
        if (frutas.some(f => name.includes(f))) {
            return 'frutas';
        }
        
        // Verduras
        const verduras = ['cenoura', 'tomate', 'alface', 'batata', 'pimentão', 'chuchu', 'coentro'];
        if (verduras.some(v => name.includes(v))) {
            return 'verduras';
        }
        
        return 'frutas'; // Padrão para frutas
    }
    
    // Função para filtrar produtos
    function applyFilters() {
        let filtered = window.products.filter(product => {
            // Filtro de categoria
            if (window.currentCategory !== 'all') {
                const category = getProductCategory(product);
                if (category !== window.currentCategory) {
                    return false;
                }
            }
            
            // Filtro de busca
            if (window.currentSearchTerm) {
                const searchTerm = window.currentSearchTerm.toLowerCase();
                const productName = (product.name || '').toLowerCase();
                const productDesc = (product.description || '').toLowerCase();
                if (!productName.includes(searchTerm) && !productDesc.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Renderizar produtos filtrados
        renderFilteredProducts(filtered);
    }
    
    // Função para renderizar produtos filtrados
    function renderFilteredProducts(productsToRender) {
        const grid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) return;
        
        if (productsToRender.length === 0) {
            if (emptyState) {
                emptyState.innerHTML = '<div class="text-6xl mb-4">🔍</div><h3 class="text-2xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3><p class="text-gray-500">Tente ajustar sua busca ou categoria.</p>';
                emptyState.style.display = 'block';
            }
            grid.style.display = 'none';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        grid.style.display = 'grid';
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        
        // Gerar HTML para produtos filtrados
        const html = productsToRender.map((p) => {
            const btnStyle = p.color ? `background: ${p.color}` : 'background: linear-gradient(135deg, #7c3aed 0%, #10b981 100%)';
            const imgClass = (p.id === 'sample_7' || p.id === 'sample_8') 
                ? 'w-full h-48 object-contain' 
                : 'w-full h-48 object-cover';
            const imgStyle = p.id === 'sample_maca_verde' ? 'transform: scale(1)' : '';
            
            const units = p.units && p.units.length > 0 ? p.units : [p.unit];
            const unitBadges = units.map(unit => 
                `<span class="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-full">${unit.toUpperCase()}</span>`
            ).join('');
            
            return `
                <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden" style="opacity: 0; animation: fadeIn 0.5s forwards;">
                    <img src="${p.image}" 
                         alt="${p.name}" 
                         class="${imgClass}"
                         style="${imgStyle}"
                         loading="lazy">
                    <div class="p-4">
                        <h3 class="text-xl font-bold text-gray-800 mb-1">${p.name}</h3>
                        ${p.description ? `<p class="text-sm text-gray-500 mb-3">${p.description}</p>` : ''}
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-2xl font-bold text-green-600">R$ ${parseFloat(p.price).toFixed(2)}</span>
                            <div class="flex gap-1">${unitBadges}</div>
                        </div>
                        <button onclick="window.openQuantityModal('${p.id}')" 
                                class="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                                style="${btnStyle}">
                            <span class="text-xl">+</span> Adicionar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    // Função para filtrar por categoria
    window.filterByCategory = function(category) {
        window.currentCategory = category;
        
        // Atualizar estado dos botões
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        
        applyFilters();
    }
    
    // Função para filtrar por busca
    window.filterBySearch = function(searchTerm) {
        window.currentSearchTerm = searchTerm;
        applyFilters();
    }
    
    // ===== MODAL DE UNIDADE E QUANTIDADE =====
    window.selectedUnit = 'kg'; // Unidade selecionada
    window.cameFromUnitModal = false; // Rastreia se veio do modal de unidade
    
    window.openQuantityModal = function(productId) {
        const product = window.products.find(p => p.id === productId);
        if (!product) return;
        
        window.currentProduct = product;
        
        // Se o produto tem múltiplas unidades, mostrar modal de seleção
        if (product.units && product.units.length > 1) {
            window.openUnitModal(productId);
        } else {
            // Caso contrário, prosseguir direto com quantidade
            window.selectedUnit = product.unit;
            window.openQuantityModalDirect();
        }
    };
    
    window.openUnitModal = function(productId) {
        const product = window.products.find(p => p.id === productId);
        if (!product) return;
        
        window.currentProduct = product;
        window.selectedUnit = product.units[0]; // Padrão: primeira opção
        
        document.getElementById('unitModalProductName').textContent = product.name;
        document.getElementById('unitModalProductImage').src = product.image;
        document.getElementById('unitModalProductPrice').textContent = `R$ ${product.price.toFixed(2)} / ${product.unit}`;
        
        // Gerar botões de unidades
        const unitOptions = document.getElementById('unitOptions');
        unitOptions.innerHTML = '';
        
        // Mapa de descrições de unidades
        const unitDescriptions = {
            'un': 'Unidade',
            'kg': 'Quilograma',
            'palma': 'Palma',
            'l': 'Litro',
            'ml': 'Mililitro'
        };
        
        product.units.forEach(unit => {
            const btn = document.createElement('button');
            btn.className = 'w-full p-4 border-2 border-gray-300 rounded-lg text-left hover:border-green-500 hover:bg-green-50 transition font-bold text-lg';
            const description = unitDescriptions[unit.toLowerCase()] || unit;
            btn.innerHTML = `<span class="text-2xl">${unit.toUpperCase()}</span><span class="text-base text-gray-600 ml-2">(${description})</span>`;
            btn.onclick = function() {
                window.selectedUnit = unit;
                window.closeUnitModal();
                window.openQuantityModalDirect();
            };
            unitOptions.appendChild(btn);
        });
        
        document.getElementById('unitModal').classList.remove('hidden');
        document.getElementById('unitModal').classList.add('flex');
    };
    
    window.closeUnitModal = function() {
        document.getElementById('unitModal').classList.add('hidden');
        document.getElementById('unitModal').classList.remove('flex');
    };
    
    window.openQuantityModalDirect = function() {
        if (!window.currentProduct) return;
        
        window.quantity = 0;
        window.cameFromUnitModal = window.currentProduct.units && window.currentProduct.units.length > 1;
        
        document.getElementById('quantityDisplay').textContent = '0';
        document.getElementById('quantityInput').value = '';
        document.getElementById('modalProductName').textContent = window.currentProduct.name;
        document.getElementById('modalProductImage').src = window.currentProduct.image;
        document.getElementById('modalProductPrice').textContent = `R$ ${window.currentProduct.price.toFixed(2)} / ${window.selectedUnit}`;
        
        const confirmBtn = document.getElementById('confirmButton');
        confirmBtn.style.background = window.currentProduct.color || 'linear-gradient(135deg, #7c3aed 0%, #10b981 100%)';
        
        document.getElementById('quantityModal').classList.remove('hidden');
        document.getElementById('quantityModal').classList.add('flex');
    };
    
    window.closeQuantityModal = function() {
        document.getElementById('quantityModal').classList.add('hidden');
        document.getElementById('quantityModal').classList.remove('flex');
        
        // Se veio do modal de unidade, reabrir o modal de unidade
        if (window.cameFromUnitModal) {
            document.getElementById('unitModal').classList.remove('hidden');
            document.getElementById('unitModal').classList.add('flex');
        }
    };

    window.showNotification = function(message, color = '#10b981') {
        const toast = document.getElementById('notificationToast');
        const messageEl = document.getElementById('notificationMessage');
        
        messageEl.textContent = message;
        toast.style.backgroundColor = color;
        toast.style.borderLeftColor = color;
        
        // Ajustar texto para melhor legibilidade
        messageEl.style.color = 'white';
        document.querySelector('#notificationToast .text-4xl').style.filter = 'brightness(1.2)';
        
        toast.classList.remove('hidden', 'notification-hide');
        toast.classList.add('block');
        
        // Dispara a animação após um curto delay
        setTimeout(() => {
            toast.classList.add('notification-hide');
        }, 2000);
        
        // Remove do DOM depois da animação
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    };
    
    window.increaseModalQuantity = function() {
        window.quantity++;
        updateQuantityDisplay();
    };
    
    window.decreaseModalQuantity = function() {
        if (window.quantity > 0) {
            window.quantity--;
            updateQuantityDisplay();
        }
    };
    
    function updateQuantityDisplay() {
        document.getElementById('quantityDisplay').textContent = window.quantity;
        document.getElementById('quantityInput').value = window.quantity || '';
    }
    
    window.addToCart = function() {
        const inputQty = parseInt(document.getElementById('quantityInput').value) || 0;
        const finalQty = Math.max(window.quantity, inputQty);
        
        if (finalQty === 0) {
            window.showErrorModal('Por favor, escolha uma quantidade maior que zero!');
            return;
        }
        
        // Procurar item existente com a mesma unidade selecionada
        const existingItem = window.cart.find(item => item.id === window.currentProduct.id && item.unit === window.selectedUnit);
        if (existingItem) {
            existingItem.quantity += finalQty;
        } else {
            window.cart.push({
                ...window.currentProduct,
                quantity: finalQty,
                unit: window.selectedUnit  // Salvar a unidade selecionada
            });
        }
        
        updateCartBadge();
        
        // Fechar todos os modais
        document.getElementById('quantityModal').classList.add('hidden');
        document.getElementById('quantityModal').classList.remove('flex');
        document.getElementById('unitModal').classList.add('hidden');
        document.getElementById('unitModal').classList.remove('flex');
        
        const mensagem = finalQty === 1 
            ? `${window.currentProduct.name} foi adicionado ao carrinho!`
            : `${finalQty} ${window.selectedUnit} de ${window.currentProduct.name} foram adicionadas ao carrinho!`;
        window.showNotification(mensagem, window.currentProduct.color);
    };
    
    // ===== CARRINHO =====
    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    
    window.toggleCart = function() {
        const modal = document.getElementById('cartModal');
        if (modal.classList.contains('hidden')) {
            renderCart();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } else {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };
    
    function renderCart() {
        const container = document.getElementById('cartItems');
        const totalEl = document.getElementById('cartTotal');
        
        if (window.cart.length === 0) {
            container.innerHTML = '<div class="text-center py-12"><div class="text-6xl mb-4">🛒</div><p class="text-gray-500 text-lg">Seu carrinho está vazio</p></div>';
            totalEl.textContent = 'R$ 0,00';
            return;
        }
        
        const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = window.cart.map((item, index) => `
            <div class="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-4 border-l-4 border-green-500 shadow-md">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg shadow-sm">
                <div class="flex-1">
                    <h4 class="font-black text-gray-800 text-lg mb-1">${item.name}</h4>
                    <p class="text-base font-semibold text-gray-700 mb-1">${item.quantity} ${item.unit} × R$ ${item.price.toFixed(2)}</p>
                    <p class="text-2xl font-black text-green-600">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="window.decreaseQuantity(${index})" class="text-white bg-blue-500 hover:bg-blue-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition">−</button>
                    <button onclick="window.increaseQuantity(${index})" class="text-white bg-green-500 hover:bg-green-600 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition">+</button>
                    <button onclick="window.removeFromCart(${index})" class="text-white bg-red-500 hover:bg-red-600 text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition">🗑️</button>
                </div>
            </div>
        `).join('');
        
        totalEl.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    window.increaseQuantity = function(index) {
        if (index >= 0 && index < window.cart.length) {
            window.cart[index].quantity++;
            updateCartBadge();
            renderCart();
        }
    };
    
    window.decreaseQuantity = function(index) {
        if (index >= 0 && index < window.cart.length) {
            if (window.cart[index].quantity > 1) {
                window.cart[index].quantity--;
                updateCartBadge();
                renderCart();
            }
        }
    };
    
    window.removeFromCart = function(index) {
        window.cart.splice(index, 1);
        updateCartBadge();
        renderCart();
    };
    
    // ===== CHECKOUT =====
    window.deliveryType = 'local'; // Padrão: retirada local
    window.deliveryData = {};
    
    window.openDeliveryModal = function() {
        if (window.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        // Resetar valores
        window.deliveryType = 'local';
        window.deliveryData = {};
        document.getElementById('deliveryForm').classList.add('hidden');
        document.getElementById('deliveryTotal').classList.add('hidden');
        document.getElementById('confirmDeliveryBtn').classList.add('hidden');
        document.getElementById('localBtn').style.borderColor = '#22c55e';
        document.getElementById('localBtn').style.backgroundColor = '#f0fdf4';
        document.getElementById('deliveryBtn').style.borderColor = '#d1d5db';
        document.getElementById('deliveryBtn').style.backgroundColor = 'white';
        
        document.getElementById('cartModal').classList.add('hidden');
        document.getElementById('deliveryModal').classList.remove('hidden');
        document.getElementById('deliveryModal').classList.add('flex');
    };
    
    window.closeDeliveryModal = function() {
        document.getElementById('deliveryModal').classList.add('hidden');
        document.getElementById('deliveryModal').classList.remove('flex');
        document.getElementById('cartModal').classList.remove('hidden');
        document.getElementById('cartModal').classList.add('flex');
    };
    
    window.selectDeliveryType = function(type) {
        window.deliveryType = type;
        const localBtn = document.getElementById('localBtn');
        const deliveryBtn = document.getElementById('deliveryBtn');
        const deliveryForm = document.getElementById('deliveryForm');
        const deliveryTotal = document.getElementById('deliveryTotal');
        const confirmBtn = document.getElementById('confirmDeliveryBtn');
        
        if (type === 'local') {
            localBtn.style.borderColor = '#22c55e';
            localBtn.style.backgroundColor = '#f0fdf4';
            deliveryBtn.style.borderColor = '#d1d5db';
            deliveryBtn.style.backgroundColor = 'white';
            deliveryForm.classList.add('hidden');
            deliveryTotal.classList.add('hidden');
        } else {
            deliveryBtn.style.borderColor = '#3b82f6';
            deliveryBtn.style.backgroundColor = '#eff6ff';
            localBtn.style.borderColor = '#d1d5db';
            localBtn.style.backgroundColor = 'white';
            deliveryForm.classList.remove('hidden');
            deliveryTotal.classList.remove('hidden');
            updateDeliveryTotal();
        }
        
        confirmBtn.classList.remove('hidden');
    };
    
    function updateDeliveryTotal() {
        const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = window.deliveryType === 'delivery' ? 3.00 : 0;
        const total = cartTotal + deliveryFee;
        
        document.getElementById('deliveryTotalValue').textContent = `R$ ${total.toFixed(2)}`;
        
        // Mostrar breakdown do valor
        const breakdownEl = document.getElementById('deliveryTotalBreakdown');
        if (window.deliveryType === 'delivery') {
            breakdownEl.textContent = `Produtos: R$ ${cartTotal.toFixed(2)} + Taxa: R$ ${deliveryFee.toFixed(2)}`;
        } else {
            breakdownEl.textContent = '';
        }
    }
    
    window.showErrorModal = function(message) {
        const modal = document.getElementById('errorModal');
        const messageEl = document.getElementById('errorMessage');
        messageEl.textContent = message;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };
    
    window.closeErrorModal = function() {
        const modal = document.getElementById('errorModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };
    
    window.confirmDelivery = function() {
        if (window.deliveryType === 'delivery') {
            // Validar campos de delivery
            const name = document.getElementById('deliveryName').value.trim();
            const phone = document.getElementById('deliveryPhone').value.trim();
            const address = document.getElementById('deliveryAddress').value.trim();
            const bloco = document.getElementById('deliveryBloco').value.trim();
            const apto = document.getElementById('deliveryApto').value.trim();
            
            if (!name || !phone || !address) {
                window.showErrorModal('Por favor, preencha todos os campos obrigatórios:\n\n✓ Nome\n✓ Telefone\n✓ Endereço');
                return;
            }
            
            window.deliveryData = {
                name,
                phone,
                address,
                bloco,
                apto
            };
        }
        
        window.checkout();
    };
    
    window.checkout = function() {
        if (window.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = window.deliveryType === 'delivery' ? 3.00 : 0;
        const total = cartTotal + deliveryFee;
        
        let settings = {};
        try {
            settings = JSON.parse(localStorage.getItem('hortifruti_settings') || '{}');
        } catch (e) {
            console.warn('Erro ao carregar settings');
        }
        
        document.getElementById('pixKey').textContent = settings.pixKey || 'Não configurado';
        document.getElementById('pixTotal').textContent = `R$ ${total.toFixed(2)}`;
        
        document.getElementById('deliveryModal').classList.add('hidden');
        document.getElementById('deliveryModal').classList.remove('flex');
        document.getElementById('pixModal').classList.remove('hidden');
        document.getElementById('pixModal').classList.add('flex');
    };
    
    window.closePixModal = function() {
        document.getElementById('pixModal').classList.add('hidden');
        document.getElementById('pixModal').classList.remove('flex');
        window.toggleCart();
    };
    
    window.copyPix = function() {
        const pixKey = document.getElementById('pixKey').textContent;
        navigator.clipboard.writeText(pixKey);
        alert('✅ Chave PIX copiada!');
    };
    
    window.sendToWhatsApp = function() {
        const cartTotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = window.deliveryType === 'delivery' ? 3.00 : 0;
        const total = cartTotal + deliveryFee;
        
        let settings = {};
        try {
            settings = JSON.parse(localStorage.getItem('hortifruti_settings') || '{}');
        } catch (e) {}
        
        let message = '🛒 *NOVO PEDIDO - HORTIFRUTI VILA NATAL*\n\n';
        message += '*Itens do Pedido:*\n';
        
        window.cart.forEach(item => {
            message += `\n• ${item.quantity} ${item.unit} de ${item.name}\n`;
            message += `  R$ ${item.price.toFixed(2)} × ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n*Subtotal: R$ ${cartTotal.toFixed(2)}*\n`;
        
        // Adicionar informações de entrega
        if (window.deliveryType === 'delivery') {
            message += `\n*📍 ENTREGA (DELIVERY)*\n`;
            message += `Taxa: R$ 3,00\n`;
            message += `\n*Dados do Cliente:*\n`;
            message += `👤 *Nome:* ${window.deliveryData.name}\n`;
            message += `📱 *Telefone:* ${window.deliveryData.phone}\n`;
            message += `📍 *Endereço:* ${window.deliveryData.address}\n`;
            if (window.deliveryData.bloco) {
                message += `🏢 *Bloco:* ${window.deliveryData.bloco}\n`;
            }
            if (window.deliveryData.apto) {
                message += `🚪 *Apartamento:* ${window.deliveryData.apto}\n`;
            }
        } else {
            message += `\n*🏪 RETIRADA NO LOCAL*\n`;
        }
        
        message += `\n*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
        message += `💳 *Chave PIX:* ${settings.pixKey || 'Não configurado'}\n`;
        
        const whatsappUrl = `https://wa.me/5581971028677?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        window.cart = [];
        window.deliveryType = 'local';
        window.deliveryData = {};
        updateCartBadge();
        window.closePixModal();
    };
    
    // ===== SINCRONIZAÇÃO AUTOMÁTICA DE PRODUTOS =====
    let lastProductsHash = null;
    let checkCounter = 0;
    
    function checkForProductUpdates() {
        checkCounter++;
        
        try {
            const stored = localStorage.getItem('hortifruti_products');
            
            if (!stored) {
                if (checkCounter % 15 === 0) {
                    addDebugMessage(`⏳ Check #${checkCounter}: localStorage vazio`, 'warning');
                }
                return;
            }
            
            // Criar hash dos produtos atuais para detectar mudanças
            const currentHash = stored.substring(0, 50) + stored.length;
            
            if (lastProductsHash === null) {
                // Primeira vez
                lastProductsHash = currentHash;
                if (checkCounter === 1) {
                    addDebugMessage(`📦 Hash inicializado na verificação #1`, 'info');
                }
                return;
            }
            
            if (lastProductsHash !== currentHash) {
                addDebugMessage(`🔄 MUDANÇA DETECTADA em #${checkCounter}!`, 'sync');
                
                try {
                    const updated = JSON.parse(stored);
                    
                    if (Array.isArray(updated) && updated.length > 0) {
                        // Verificar se realmente mudou
                        const productsChanged = updated.length !== window.products.length ||
                            updated.some((p, i) => 
                                !window.products[i] || 
                                p.id !== window.products[i].id ||
                                p.name !== window.products[i].name ||
                                p.price !== window.products[i].price
                            );
                        
                        if (productsChanged) {
                            addDebugMessage(`✅ PRODUTOS MUDARAM: ${window.products.length} → ${updated.length}`, 'success');
                            
                            window.products = updated;
                            lastProductsHash = currentHash;
                            
                            console.log('%c✅ Produtos sincronizados:', 'color: green; font-weight: bold;', window.products.length, 'itens');
                            window.products.forEach((p, i) => {
                                if (i < 3) console.log(`  [${i+1}] ${p.name}`);
                            });
                            
                            addDebugMessage('🎨 Renderizando nova grade...', 'info');
                            renderProducts();
                            addDebugMessage('✅ Grade atualizada!', 'success');
                        } else {
                            lastProductsHash = currentHash;
                        }
                    }
                } catch (err) {
                    addDebugMessage(`❌ Erro ao parsear: ${err.message}`, 'error');
                }
            } else {
                // Sem mudanças
                if (checkCounter % 30 === 0) {
                    addDebugMessage(`⏳ Check #${checkCounter}: Monitorando...`, 'info');
                }
            }
        } catch (err) {
            addDebugMessage(`❌ Erro verificação #${checkCounter}: ${err.message}`, 'error');
        }
    }
    
    // ===== PAINEL DE DEBUG VISUAL =====
    window.debugMessages = [];
    
    function addDebugMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            'info': '#3b82f6',
            'success': '#10b981',
            'warning': '#f59e0b',
            'error': '#ef4444',
            'sync': '#8b5cf6'
        };
        
        const msg = {
            time: timestamp,
            text: message,
            type: type,
            color: colors[type] || colors['info']
        };
        
        window.debugMessages.push(msg);
        
        // Manter últimas 50 mensagens
        if (window.debugMessages.length > 50) {
            window.debugMessages.shift();
        }
        
        // Atualizar painel visual
        updateDebugPanel();
        
        // Também log no console
        console.log(`[${timestamp}] ${message}`);
    }
    
    function updateDebugPanel() {
        const logEl = document.getElementById('debugLog');
        if (!logEl) return;
        
        logEl.innerHTML = window.debugMessages.map(m => `
            <div style="color: ${m.color}; margin-bottom: 6px; padding: 4px; border-left: 2px solid ${m.color}; padding-left: 8px;">
                <span style="opacity: 0.7;">[${m.time}]</span> ${m.text}
            </div>
        `).join('');
        
        // Scroll para o final
        logEl.scrollTop = logEl.scrollHeight;
    }
    
    window.toggleDebugPanel = function() {
        const panel = document.getElementById('debugPanel');
        if (panel) {
            panel.classList.toggle('hidden');
        }
    }
    
    // ===== SINCRONIZAÇÃO MANUAL =====
    window.syncProductsNow = function() {
        console.log('%c🔄 SINCRONIZAÇÃO MANUAL INICIADA...', 'color: blue; font-weight: bold; font-size: 16px;');
        addDebugMessage('🔄 SINCRONIZAÇÃO MANUAL...', 'sync');
        
        let found = false;
        
        // Tentar localStorage (prioridade)
        const storedLocal = localStorage.getItem('hortifruti_products');
        if (storedLocal && storedLocal.trim() !== '') {
            try {
                const parsed = JSON.parse(storedLocal);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('%c✅ Encontrado no localStorage:', 'color: green;', parsed.length, 'produtos');
                    addDebugMessage(`✅ Encontrado ${parsed.length} produtos no localStorage!`, 'success');
                    window.products = parsed;
                    lastProductsHash = storedLocal.substring(0, 50) + storedLocal.length;
                    renderProducts();
                    addDebugMessage(`✅ ${window.products.length} produtos agora visíveis!`, 'success');
                    found = true;
                    return;
                }
            } catch (e) {
                console.error('%c❌ Erro ao parsear localStorage:', 'color: red;', e);
                addDebugMessage(`⚠️ localStorage erro: ${e.message}`, 'warning');
            }
        }
        
        // Tentar sessionStorage
        const storedSession = sessionStorage.getItem('hortifruti_products');
        if (storedSession && storedSession.trim() !== '') {
            try {
                const parsed = JSON.parse(storedSession);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log('%c✅ Encontrado no sessionStorage:', 'color: green;', parsed.length, 'produtos');
                    addDebugMessage(`✅ Encontrado ${parsed.length} produtos no sessionStorage!`, 'success');
                    window.products = parsed;
                    lastProductsHash = storedSession.substring(0, 50) + storedSession.length;
                    renderProducts();
                    addDebugMessage(`✅ ${window.products.length} produtos agora visíveis!`, 'success');
                    found = true;
                    return;
                }
            } catch (e) {
                console.error('%c❌ Erro ao parsear sessionStorage:', 'color: red;', e);
                addDebugMessage(`⚠️ sessionStorage erro: ${e.message}`, 'warning');
            }
        }
        
        // Tentar window.name
        try {
            if (window.name && window.name.startsWith('hortifruti_')) {
                const data = window.name.substring(11);
                const parsed = JSON.parse(decodeURIComponent(data));
                if (Array.isArray(parsed) && parsed.length > 0) {
                    addDebugMessage(`✅ Encontrado ${parsed.length} produtos em window.name!`, 'success');
                    window.products = parsed;
                    renderProducts();
                    addDebugMessage(`✅ ${window.products.length} produtos agora visíveis!`, 'success');
                    found = true;
                    return;
                }
            }
        } catch (e) {
            // window.name vazio ou erro ao decodificar
        }
        
        if (!found) {
            addDebugMessage('', 'info');
            addDebugMessage('⚠️ Nenhum armazenamento tem produtos ainda.', 'warning');
            addDebugMessage('', 'info');
            addDebugMessage('PASSO A PASSO:', 'info');
            addDebugMessage('1️⃣ Clique em 📋 "Abrir Admin" (canto superior direito)', 'info');
            addDebugMessage('2️⃣ Adicione ou edite um produto', 'info');
            addDebugMessage('3️⃣ Clique em "Salvar Produto"', 'info');
            addDebugMessage('4️⃣ Volte para esta aba', 'info');
            addDebugMessage('5️⃣ Clique em "🔄 SINCRONIZAR AGORA"', 'info');
            addDebugMessage('', 'info');
        }
    }
    
    // ===== SETUP INPUTS =====
    function setupQuantityInput() {
        const input = document.getElementById('quantityInput');
        if (input) {
            input.addEventListener('input', function(e) {
                window.quantity = parseInt(e.target.value) || 0;
                document.getElementById('quantityDisplay').textContent = window.quantity;
            });
        }
    }
    
    // ===== INICIALIZAÇÃO =====
    let initialized = false;
    
    function init() {
        if (initialized) {
            addDebugMessage('Init já foi executado, ignorando duplicada', 'warning');
            return;
        }
        initialized = true;
        
        addDebugMessage('═══════════════════════════════════', 'info');
        addDebugMessage('🚀 HORTIFRUTI - INICIALIZANDO...', 'success');
        addDebugMessage('═══════════════════════════════════', 'info');
        
        // Teste localStorage
        addDebugMessage('', 'info');
        addDebugMessage('📋 TESTE 1: Verificando localStorage', 'info');
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            const result = localStorage.getItem(test);
            localStorage.removeItem(test);
            
            if (result === test) {
                addDebugMessage('✅ localStorage está FUNCIONANDO', 'success');
            } else {
                addDebugMessage('❌ localStorage NÃO funciona', 'error');
            }
        } catch (e) {
            addDebugMessage(`❌ localStorage desabilitado: ${e.message}`, 'error');
        }
        
        // Carregar produtos
        addDebugMessage('', 'info');
        addDebugMessage('📋 TESTE 2: Carregando produtos', 'info');
        loadProducts();
        addDebugMessage(`✅ ${window.products.length} produtos em memória`, 'success');
        
        // Renderizar
        addDebugMessage('', 'info');
        addDebugMessage('📋 TESTE 3: Renderizando grid', 'info');
        renderProducts();
        addDebugMessage('✅ Grid renderizado', 'success');
        
        // Atualizar status da loja
        updateStoreStatus();
        // Atualizar status a cada minuto
        setInterval(updateStoreStatus, 60000);
        
        // Setup inputs
        addDebugMessage('', 'info');
        addDebugMessage('📋 TESTE 4: Configurando eventos', 'info');
        setupQuantityInput();
        
        // Setup search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                window.filterBySearch(e.target.value);
            });
        }
        
        addDebugMessage('✅ Eventos configurados', 'success');
        
        // Sincronização
        addDebugMessage('', 'info');
        addDebugMessage('📋 TESTE 5: Iniciando sincronização', 'info');
        lastProductsHash = null;
        const syncInterval = setInterval(checkForProductUpdates, 2000);
        addDebugMessage('✅ Verificação a cada 2 segundos ativa', 'success');
        addDebugMessage('📌 Window.storage event listener ativo', 'success');
        
        addDebugMessage('', 'info');
        addDebugMessage('═══════════════════════════════════', 'success');
        addDebugMessage('✅ SITE PRONTO PARA USAR!', 'success');
        addDebugMessage('═══════════════════════════════════', 'success');
        addDebugMessage('', 'info');
        addDebugMessage('📱 Em mobile: Abra admin.html em OUTRA ABA', 'warning');
        addDebugMessage('📱 Ambas abas do MESMO navegador', 'warning');
        addDebugMessage('📱 Clique em 🔄 aqui ou edite no admin', 'warning');
        
        // Em mobile, adicionar listener para recarregar quando aba ficar visível
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                addDebugMessage('👁️ Aba voltou ao foco - sincronizando...', 'info');
                checkForProductUpdates();
            }
        });
    }
    
    // Esperar pelo DOM estar completamente pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();