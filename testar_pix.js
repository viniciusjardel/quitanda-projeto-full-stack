#!/usr/bin/env node

// Script para testar a geração de PIX com CRC16 correto
// Execute com: node testar_pix.js

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

// Testes
console.log('╔════════════════════════════════════════╗');
console.log('║  TESTE GERAÇÃO DE PIX COM CRC16       ║');
console.log('╚════════════════════════════════════════╝\n');

// Teste 1: Chave com números soltos
const pixKey1 = '81992659707';
const amount1 = 17.97;
const code1 = generatePixCode(pixKey1, amount1);

console.log('📋 Teste 1: Chave CPF');
console.log(`  Chave: ${pixKey1}`);
console.log(`  Valor: R$ ${amount1.toFixed(2)}`);
console.log(`  Código PIX: ${code1}`);
console.log(`  Comprimento: ${code1.length} caracteres`);
console.log(`  CRC16: ${code1.slice(-4)}`);
console.log('');

// Teste 2: Valor maior
const pixKey2 = '12345678900';
const amount2 = 150.50;
const code2 = generatePixCode(pixKey2, amount2);

console.log('📋 Teste 2: Valor maior');
console.log(`  Chave: ${pixKey2}`);
console.log(`  Valor: R$ ${amount2.toFixed(2)}`);
console.log(`  Código PIX: ${code2}`);
console.log(`  Comprimento: ${code2.length} caracteres`);
console.log(`  CRC16: ${code2.slice(-4)}`);
console.log('');

// Teste 3: Chave com máscara
const pixKey3 = '123.456.789-00';
const amount3 = 99.99;
const code3 = generatePixCode(pixKey3, amount3);

console.log('📋 Teste 3: Chave com máscara');
console.log(`  Chave: ${pixKey3}`);
console.log(`  Valor: R$ ${amount3.toFixed(2)}`);
console.log(`  Código PIX: ${code3}`);
console.log(`  Comprimento: ${code3.length} caracteres`);
console.log(`  CRC16: ${code3.slice(-4)}`);
console.log('');

console.log('✅ Testes concluídos!');
console.log('');
console.log('📌 Dicas:');
console.log('  • Copie o código PIX e teste no seu banco');
console.log('  • O CRC16 é sempre os 4 últimos dígitos');
console.log('  • Se der erro 2055, o CRC está incorreto');
console.log('');
