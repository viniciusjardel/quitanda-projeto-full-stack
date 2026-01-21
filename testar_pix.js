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
