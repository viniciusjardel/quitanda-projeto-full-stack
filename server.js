const http = require('http');

// CRC16-CCITT polynomial 0x1021 - Algoritmo correto do Banco Central
function calculateCRC16(data) {
    let crc = 0xFFFF;
    
    for (let i = 0; i < data.length; i++) {
        let byte = data.charCodeAt(i);
        crc ^= (byte << 8);
        
        for (let j = 0; j < 8; j++) {
            crc <<= 1;
            if (crc & 0x10000) {
                crc = (crc ^ 0x1021) & 0xFFFF;
            }
        }
    }
    
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Gerar PIX - Versão CORRIGIDA com tamanhos corretos
function generatePixCode(pixKey, amount) {
    const key = pixKey.replace(/\D/g, '');
    
    let data = '';
    data += '00' + '02' + '01';  // Versão 01
    
    // Campo 26: Merchant Account Information
    const pixId = 'br.gov.bcb.pix';
    // Subtag 00: Identificador
    let sub00 = '00' + String(pixId.length).padStart(2, '0') + pixId;
    // Subtag 01: Chave
    let sub01 = '01' + String(key.length).padStart(2, '0') + key;
    // Campo 26 completo
    let field26 = sub00 + sub01;
    data += '26' + String(field26.length).padStart(2, '0') + field26;
    
    data += '52' + '04' + '5411';  // MCC - Supermercado/Hortifruti
    data += '53' + '03' + '986';   // BRL
    
    // Campo 54: Valor (REMOVIDO - alguns bancos rejeitam PIX com valor pré-definido)
    // if (amount > 0) {
    //     const valueStr = Math.round(amount * 100).toString();
    //     data += '54' + String(valueStr.length).padStart(2, '0') + valueStr;
    // }
    
    // Campo 59: Nome do recebedor (obrigatório em PIX dinâmico)
    const merchantName = 'Quitanda Villa Natal';
    data += '59' + String(merchantName.length).padStart(2, '0') + merchantName;
    
    data += '58' + '02' + 'BR';  // País
    
    // Calcular CRC16
    const crc = calculateCRC16(data);
    data += '63' + '04' + crc;
    
    return data;
}

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (req.url === '/api/health') {
        res.end(JSON.stringify({ status: 'online', message: 'Backend OK!' }));
    } else if (req.url === '/api/gerar-pix' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { pixKey, amount } = data;
                
                const pixCode = generatePixCode(pixKey, amount);
                
                console.log('✅ PIX gerado:', pixCode);
                
                res.end(JSON.stringify({
                    success: true,
                    pixCode: pixCode,
                    pixKey: pixKey,
                    amount: amount,
                    message: 'OK'
                }));
            } catch(e) {
                console.error('❌ Erro:', e.message);
                res.end(JSON.stringify({
                    success: false,
                    error: e.message
                }));
            }
        });
    } else {
        res.end(JSON.stringify({ message: 'Quitanda Backend' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});

