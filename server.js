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

// Gerar PIX EMVCo-compliant com CRC16 válido
function generatePixCode(pixKey, amount) {
    // Remover caracteres especiais da chave PIX
    const pixKeyClean = pixKey.replace(/\D/g, '');
    
    let pixString = '';
    
    // 00: Payload Format Indicator (sempre 01)
    pixString += '000201';
    
    // 26: Merchant Account Information - PIX (Identificador 26)
    const pixField = 'br.gov.bcb.pix';  // Sem o "00" - isso é TAG, não valor!
    const pixFieldValue = pixKeyClean;
    let accountInfo = '00' + String(pixField.length).padStart(2, '0') + pixField;
    accountInfo += '01' + String(pixFieldValue.length).padStart(2, '0') + pixFieldValue;
    pixString += '26' + String(accountInfo.length).padStart(2, '0') + accountInfo;
    
    // 52: Merchant Category Code (sempre 0000 para pessoas)
    pixString += '52040000';
    
    // 53: Transaction Currency (986 = BRL - Real Brasileiro)
    pixString += '5303986';
    
    // 54: Transaction Amount (em reais, sem decimal - máx 13 dígitos)
    const amountInCents = Math.round(amount * 100);
    // Valor sem zeros à esquerda desnecessários
    const amountStr = String(amountInCents);
    if (amountInCents > 0 && amountInCents <= 9999999999999) {
        // Campo 54 com tamanho variável (não preencher com zeros à esquerda)
        pixString += '54' + String(amountStr.length).padStart(2, '0') + amountStr;
    }
    
    // 58: Country Code (sempre BR)
    pixString += '5802BR';
    
    // 59: Merchant Name (OPTIONAL - remover se der erro)
    // const merchantName = 'QUITANDA';
    // pixString += '59' + String(merchantName.length).padStart(2, '0') + merchantName;
    
    // 60: Merchant City (OPTIONAL - remover se der erro)
    // const merchantCity = 'JABOATAO';
    // pixString += '60' + String(merchantCity.length).padStart(2, '0') + merchantCity;
    
    // Calcular CRC16 ANTES de adicionar o campo CRC
    const crc16 = calculateCRC16(pixString);
    
    // 63: CRC16 (campo final)
    pixString += '6304' + crc16;
    
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

