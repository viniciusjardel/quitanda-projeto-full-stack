# 🚀 GUIA DE TESTE - QR Code e PIX

## ✅ Checklist Pré-Teste

- [ ] Servidor Node.js está rodando (ou acesso ao Render.com)
- [ ] `index.html` foi aberto no navegador
- [ ] Console do navegador está aberto (F12)
- [ ] Tem produto adicionado ao carrinho
- [ ] Chave PIX está configurada em Admin

---

## 📊 Teste 1: Validação do PIX (Terminal)

### 🎯 Objetivo
Validar que o código PIX está sendo gerado corretamente

### ⚡ Comando
```bash
cd "c:\Users\jarde\OneDrive\Desktop\Projeto Quitanda Villa Natal - COM BACK SIMPLES"
node testar_pix.js
```

### ✅ Esperado
```
╔════════════════════════════════════════╗
║  TESTE GERAÇÃO DE PIX COM CRC16       ║
╚════════════════════════════════════════╝

📋 Teste 1: Chave CPF
  Chave: 81992659707
  Valor: R$ 17.97
  Código PIX: 0002012635001600br.gov.bcb.pix...
  CRC16: C16C   ← Diferente para cada teste

📋 Teste 2: Valor maior
  ...

📋 Teste 3: Chave com máscara
  ...

✅ Testes concluídos!
```

### ❌ Se Falhar
- Erro ao executar? Verifique se Node.js está instalado
- Código PIX vazio? Problema no algoritmo (não deve acontecer)

---

## 🌐 Teste 2: QR Code no Navegador

### 🎯 Objetivo
Validar que QR code é gerado quando cliente escolhe essa opção

### 📱 Passos

#### 1. Adicionar Produto ao Carrinho
```
1. Abrir index.html no navegador
2. Clicar em qualquer produto
3. Clicar "Adicionar ao Carrinho"
```

#### 2. Ir para Checkout
```
1. Clicar em "🛒 Carrinho" (canto superior direito)
2. Ver valor total
3. Clicar "Finalizar Pedido"
```

#### 3. Escolher Entrega
```
1. Escolher "Retirada no Local" ou "Entrega"
2. Clicar em um deles
```

#### 4. **NOVO!** - Escolher Forma de Pagamento
```
1. Agora aparece "Escolha o Método de Pagamento:"
2. Tem 4 opções:
   - 💜 PIX (simples)
   - 💳 Cartão de Crédito
   - 🏦 Cartão de Débito
   - 📱 QR Code PIX  ← ESCOLHER ESTE
```

#### 5. Verificar QR Code
```
1. Deve aparecer um modal com:
   ✅ QR Code gerado (imagem quadrada)
   ✅ Chave PIX exibida
   ✅ Valor do pedido
   ✅ Botão "📋 Copiar Chave PIX"
```

### 📟 Verificar Console (F12)

#### Logs Esperados
```javascript
🔍 generateQrCode iniciado: { pixKey: '81992659707', amount: 17.97 }
📡 Chamando backend: https://quitanda-backend.onrender.com/api/gerar-pix
📊 Dados: { pixKey: '81992659707', amount: 17.97 }
📋 Resposta status: 200
📦 Resposta backend: { success: true, pixCode: '0002...' }
✅ PIX recebido: 0002...
✅ QR Code gerado com sucesso!
✅ PIX gerado com sucesso pelo backend!
📌 Chave PIX: 81992659707
💰 Valor: R$ 17.97
📱 Código PIX completo: 0002...
```

#### ❌ Se Houver Erro
```javascript
❌ Erro ao gerar QR Code: ...
```
- Copiar a mensagem de erro
- Ver "[🔍 Checklist de Erro](#checklist-de-erro)" abaixo

### ✅ Sucesso
Se vir QR code e console verde = **PASSOU** ✅

---

## 📋 Teste 3: Copiar Chave PIX

### 🎯 Objetivo
Validar que botão de cópia funciona

### 📱 Passos

1. **Com o modal aberto:**
   ```
   1. Clicar em "📋 Copiar Chave PIX"
   2. Botão muda para "✅ Chave copiada!" (verde)
   3. Volta ao normal após 2 segundos
   ```

2. **Verificar se copiou:**
   ```
   1. Abrir bloco de notas (ou qualquer editor)
   2. Colar (Ctrl+V)
   3. Deve aparecer algo assim:
      0002012635001600br.gov.bcb.pix011181992659707...
   ```

3. **Verificar Console:**
   ```javascript
   📋 Copiando: 0002...
   ✅ Código PIX copiado com sucesso!
   ```

### ✅ Sucesso
Se texto foi colado = **PASSOU** ✅

---

## 🏦 Teste 4: Validação com Banco (OPCIONAL)

### ⚠️ Importante
Esse teste é apenas se quiser validar com um banco real.

### 🎯 Objetivo
Validar que código PIX é aceito pelo Banco Central

### 📱 Passos

1. **Copiar código PIX:**
   ```
   1. Clicar "Copiar Chave PIX"
   2. Código foi copiado
   ```

2. **Abrir seu banco:**
   ```
   1. Abrir app de um banco
   2. Ir em "PIX"
   3. Escolher "Pagar com QR Code" ou "Cópia e Cola"
   ```

3. **Colar ou ler:**
   ```
   Se "Cópia e Cola":
   - Colar o código (Ctrl+V)
   - Clicar "Continuar"
   - Se aceitar = CRC16 está certo ✅
   - Se der erro 2055 = problema no CRC16 ❌
   ```

### ✅ Sucesso
Banco aceitou o código = **PASSOU** ✅

---

## 🔍 Checklist de Erro

### ❌ QR Code não aparece

**Verifique:**
1. Console tem `❌ Erro ao gerar QR Code`?
   - Sim → Copiar mensagem de erro exata
   - Não → Ir para "Biblioteca QRCode"

2. **Biblioteca QRCode:**
   ```javascript
   // No console, digitar:
   typeof QRCode
   // Deve retornar: "function"
   // Se retornar: "undefined" = biblioteca não carregou
   ```

3. **Dados da requisição:**
   ```javascript
   // No console, digitar:
   console.log(window.checkoutTotal)
   console.log(localStorage.hortifruti_settings)
   // Devem ter valores válidos
   ```

### ❌ Erro 2055 do Banco

**Significa:** CRC16 inválido

**Verifique:**
1. Teste local passou? (`node testar_pix.js`)
   - Não → Problema no algoritmo do servidor
   - Sim → Problema em outra parte

2. Backend está respondendo?
   ```javascript
   // No console, digitar:
   fetch('https://quitanda-backend.onrender.com/api/health')
   .then(r => r.json())
   .then(d => console.log(d))
   // Deve retornar algo tipo: { status: 'online' }
   ```

### ❌ Copiar não funciona

**Verifique:**
1. Console mostra ✅ ou ❌?
   - ✅ = Copiar funcionou, testar in Ctrl+V
   - ❌ = Ver mensagem de erro

2. Navegador permite?
   ```javascript
   // Alguns navegadores bloqueiam em HTTP
   // Use HTTPS ou localhost
   ```

### ❌ Botão não muda de cor

**Isso NÃO impede a cópia!**
- Cópia funcionou mesmo assim
- Apenas feedback visual falhou
- Tente Ctrl+V para confirmar

---

## 📊 Tabela de Status

| Teste | Status | Passar? |
|-------|--------|---------|
| 1. Geração PIX (node) | ✅ ou ❌ | Deve ser ✅ |
| 2. QR Code no navegador | ✅ ou ❌ | Deve ser ✅ |
| 3. Copiar chave | ✅ ou ❌ | Deve ser ✅ |
| 4. Banco (opcional) | ✅ ou ❌ | Deve ser ✅ |

**Sucesso:** 3 de 4 testes passando ✅

---

## 📝 Reportar Problema

Se algo não funcionar:

1. **Tire screenshot do erro**
2. **Copie mensagem exata do console**
3. **Inclua:**
   - Navegador (Chrome, Firefox, Edge)
   - Sistema Operacional (Windows, Mac, Linux)
   - Versão Node.js (se aplicável)
   - Teste específico que falhou

---

## 💡 Dicas

- 🔍 Sempre abra console (F12) para ver logs
- 📱 Mobile? Use DevTools do navegador
- 🌐 Problema de conexão? Verifique internet
- 🔄 Recargue página (Ctrl+R) após mudanças
- 💾 Limpe localStorage se tiver erro: `localStorage.clear()`

---

**Última atualização:** 21/01/2026
**Status:** ✅ Pronto para testar
