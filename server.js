const http = require('http');

// CRC16-CCITT usado pelo Banco Central para PIX
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

// Gerar PIX EMVCo-compliant com CRC16 válido
function generatePixCode(pixKey, amount) {
    // Template ID: 26 (Merchant Account Information)
    const pixKeyField = `0br.gov.bcb.pix`;
    const pixKeyValue = pixKey;
    
    // Montar a estrutura EMV
    let pixString = '';
    
    // 00: Versão (00 = 01)
    pixString += '0001';
    
    // 26: Merchant Account Information (PIX)
    const accountInfo = '00' + pixKeyField.length.toString().padStart(2, '0') + pixKeyField + 
                        '01' + pixKeyValue.length.toString().padStart(2, '0') + pixKeyValue;
    pixString += '26' + accountInfo.length.toString().padStart(2, '0') + accountInfo;
    
    // 52: Merchant Category Code (04 = Serviços diversos)
    pixString += '5204' + '0000';
    
    // 53: Transaction Currency (986 = BRL)
    pixString += '5303' + '986';
    
    // 54: Transaction Amount (formato: sem decimais com 2 casas)
    const amountStr = Math.round(amount * 100).toString().padStart(13, '0');
    pixString += '54' + amountStr.length.toString().padStart(2, '0') + amountStr;
    
    // 58: Country Code (BR)
    pixString += '5802' + 'BR';
    
    // 59: Merchant Name (QUITANDA)
    const merchantName = 'QUITANDA';
    pixString += '59' + merchantName.length.toString().padStart(2, '0') + merchantName;
    
    // 60: Merchant City (JABOATAO)
    const merchantCity = 'JABOATAO';
    pixString += '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity;
    
    // 62: Additional Data (com Transaction ID)
    const txnId = '***';
    const additionalData = '05' + txnId.length.toString().padStart(2, '0') + txnId;
    pixString += '62' + additionalData.length.toString().padStart(2, '0') + additionalData;
    
    // Calcular CRC16
    const crc = calculateCRC16(pixString);
    
    // 63: CRC16
    pixString += '63' + crc;
    
    return pixString;
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

