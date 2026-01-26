# 🍎 Quitanda Villa Natal - Projeto Completo

## 📁 Estrutura do Projeto

```
Quitanda-Villa-Natal/
├── frontend/               # Frontend (Netlify)
│   ├── index.html
│   ├── admin.html
│   ├── styles.css
│   ├── script.js
│   ├── script-site.js
│   └── img/
│
├── backend/                # Backend (Render)
│   ├── server.js
│   ├── package.json
│   ├── Procfile
│   ├── .env.example
│   ├── testar_pix.js
│   ├── setup-pix.js
│   └── ...
│
├── arquivos md/            # Documentação
│   └── ...
│
├── SETUP_MERCADO_PAGO.md   # Guia Mercado Pago
├── MERCADO_PAGO_PRONTO.md  # Status Mercado Pago
└── README.md              # Este arquivo
```

---

## 🚀 Deploy

### Frontend (Netlify)
- Pasta: `/frontend`
- URL: https://quitanda-villa-natal.netlify.app
- Atualizar com: Faça push no GitHub, Netlify atualiza automaticamente

### Backend (Render)
- Pasta: `/backend`
- URL: https://quitanda-backend.onrender.com
- Atualizar com: Faça push no GitHub, Render atualiza automaticamente

---

## 🔧 Configuração Local

### Frontend
```bash
cd frontend
# Abra index.html em um navegador ou use um servidor local
```

### Backend
```bash
cd backend
npm install
node server.js
```

---

## 📋 Integração Mercado Pago

Veja `SETUP_MERCADO_PAGO.md` para instruções completas.

---

## 💡 Dicas

- Todo arquivo estático (HTML, CSS, JS) vai na pasta `/frontend`
- Toda lógica de servidor vai em `/backend`
- Documentação vai na raiz ou em `/arquivos md/`

