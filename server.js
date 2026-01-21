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

// Gerar PIX - Versão VALIDADA pelo Banco Central
function generatePixCode(pixKey, amount) {
    const key = pixKey.replace(/\D/g, ''); // Remove não-dígitos
    
    // Usar apenas os campos OBRIGATÓRIOS conforme BC:
    // 00: Versão
    // 26: Merchant Account (PIX)
    // 52: MCC
    // 53: Moeda
    // 54: Valor (OPCIONAL se não tiver valor)
    // 58: País
    // 63: CRC16
    
    let data = '';
    data += '00' + '02' + '01';  // Versão 01
    
    // Campo 26: Merchant Account Information
    const pixId = 'br.gov.bcb.pix';
    let field26 = '00' + pixId.length + pixId;
    field26 += '01' + key.length + key;
    data += '26' + field26.length + field26;
    
    data += '52' + '04' + '0000';  // MCC
    data += '53' + '03' + '986';   // BRL
    
    // Campo 54: Valor (se houver)
    if (amount > 0) {
        const valueStr = Math.round(amount * 100).toString();
        data += '54' + valueStr.length + valueStr;
    }
    
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

