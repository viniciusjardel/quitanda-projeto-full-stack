# 🚀 Backend PIX - Quitanda Villa Natal

## Status: ✅ RODANDO NA PORTA 3000

### 📝 Configuração Atual

**Arquivo:** `backend/.env`
```
MP_ACCESS_TOKEN=APP_USR-263860158990018-012114-c6399fa7acce80089da5a340c00e289e-3013647225
MP_WEBHOOK_SECRET=
PORT=3000
```

⚠️ **Atenção:** Falta adicionar `MP_WEBHOOK_SECRET` quando tiver disponível.

---

## 🧪 Testando a API

### 1️⃣ Health Check
```bash
curl http://localhost:3000/
```
Resposta esperada: `API PIX Mercado Pago rodando 🚀`

### 2️⃣ Gerar PIX
```bash
curl -X POST http://localhost:3000/pix \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 10.00,
    "descricao": "Teste de PIX"
  }'
```

Resposta esperada:
```json
{
  "id": 123456789,
  "status": "pending",
  "qr_code": "00020126...",
  "qr_code_base64": "iVBORw0KGgoAAAANS..."
}
```

### 3️⃣ Consultar Status
```bash
curl http://localhost:3000/status/123456789
```

---

## 🔗 Integração Frontend

O arquivo `frontend/payment.js` já está configurado para chamar:
- `http://localhost:3000/pix` - Gerar PIX
- `http://localhost:3000/status/:id` - Verificar status

**Para produção**, altere em `payment.js`:
```javascript
const API_BASE = 'https://seu-dominio.com'; // Alterar aqui
```

---

## 📱 Testando Fluxo Completo

1. Abra `frontend/index.html` no navegador
2. Adicione um produto ao carrinho
3. Clique em "Finalizar Pedido"
4. Selecione tipo de entrega
5. Veja o QR Code e código PIX
6. O status é verificado a cada 2 segundos

---

## 🛑 Parar o Servidor

No terminal onde está rodando, pressione `Ctrl + C`

---

## 📦 Estrutura

```
backend/
├── src/
│   ├── server.js          (Servidor Express + Mercado Pago)
│   ├── routes/
│   │   └── pix.routes.js  (Rotas de PIX)
│   ├── services/
│   │   └── pix.service.js (Lógica de PIX)
│   └── utils/
│       └── qrCode.js      (Geração de QR Code)
├── .env                   (Configuração)
├── package.json          
└── node_modules/
```

---

## ✅ Próximos Passos

- [ ] Adicionar MP_WEBHOOK_SECRET
- [ ] Testar pagamento real com Mercado Pago
- [ ] Deploy em produção (Render, Vercel, etc)
- [ ] Integrar banco de dados (MongoDB/PostgreSQL)
- [ ] Configurar notificações por email/SMS

