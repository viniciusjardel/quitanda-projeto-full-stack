# ✅ Mercado Pago - PRONTO PARA USAR

## Status
- ✅ Backend integrado com API Mercado Pago
- ✅ Frontend com novo botão "Mercado Pago" no checkout
- ✅ Deploy realizado automaticamente no Render
- ⏳ Aguardando configuração de credenciais

---

## 🚀 O que foi implementado

### Backend (server.js)
- Novo endpoint `/api/mercado-pago-payment`
- Comunicação segura com API Mercado Pago
- Suporte a criação de preferências de pagamento
- Tratamento de erros

### Frontend (index.html + script-site.js)
- Novo botão "Mercado Pago" no modal de pagamento
- Função `openMercadoPagoPayment()` para iniciar checkout
- Validação de email do cliente
- Redirecionamento automático para checkout MP

---

## ⚙️ Como Configurar (IMPORTANTE!)

### 1️⃣ Crie uma conta Mercado Pago
- Acesse: https://www.mercadopago.com.br
- Clique em "Criar conta"
- Faça login

### 2️⃣ Obtenha seus tokens
1. Vá para: https://www.mercadopago.com.br/developers/panel/credentials
2. Copie o **Access Token** da seção "Token de Producción"
3. Copie a **Public Key**

### 3️⃣ Configure no Render
1. Acesse: https://dashboard.render.com
2. Clique no seu aplicativo "quitanda-backend"
3. Vá para **Settings → Environment Variables**
4. Adicione uma variável:
   - **Key**: `MP_ACCESS_TOKEN`
   - **Value**: Cole seu Access Token
5. Clique "Save"
6. O app será reiniciado

### 4️⃣ Configure URLs de Retorno (Manual)
1. No painel do Mercado Pago, vá para **Configurações**
2. Configure as URLs de retorno:
   - Sucesso: `https://seu-dominio.com/sucesso`
   - Erro: `https://seu-dominio.com/erro`
   - Pendente: `https://seu-dominio.com/pendente`

---

## 🧪 Teste Localmente

Crie um arquivo `.env` na raiz do projeto:
```
MP_ACCESS_TOKEN=seu_token_aqui
MP_PUBLIC_KEY=sua_public_key_aqui
```

Depois rode:
```bash
node server.js
```

---

## 📊 Fluxo de Pagamento

1. Cliente adiciona produtos ao carrinho
2. Cliente clica em "Pagar"
3. Seleciona **"Mercado Pago"** como método
4. Digite seu email
5. Sistema cria uma preferência no MP
6. Cliente é redirecionado para o checkout do MP
7. Paga com: Cartão de crédito, Cartão de débito, PIX, Boleto, etc.
8. Retorna automaticamente (quando configurar URLs de retorno)

---

## ✅ Próximos Passos

1. ✅ Implementação: PRONTA
2. ⏳ Configurar credenciais no Render
3. ⏳ Configurar URLs de retorno
4. ⏳ Testar com pagamento de teste
5. ⏳ Ativar em produção

---

## 📞 Dúvidas Frequentes

**P: Preciso do Public Key para o frontend?**
R: Atualmente não, mas pode ser adicionado depois para modo totalmente clientside.

**P: Qual é a taxa do Mercado Pago?**
R: 2.49% + R$0,49 por transação (checkout standard).

**P: Funciona com qual banco?**
R: Funciona com qualquer banco que tenha integração MP: Bradesco, Itaú, Caixa, Nubank, Inter, etc.

**P: Se eu não configurar as credenciais, o que acontece?**
R: O botão aparecerá, mas dará erro ao clicar com mensagem "Invalid access token".

---

## 💡 Dica

Você pode manter **PIX** como opção principal (sem taxa, instantâneo) e **Mercado Pago** como alternativa para quem não tem PIX disponível!

