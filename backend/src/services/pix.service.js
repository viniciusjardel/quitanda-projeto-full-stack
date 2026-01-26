import { gerarQrCode } from '../utils/qrCode.js'

export async function criarPix(valor, descricao) {
  // PIX fake para testes locais
  const payloadPix =
    `00020126360014BR.GOV.BCB.PIX0111+5599999999999` +
    `5204000053039865405${valor}` +
    `5802BR5913PIX TESTE6009SAO PAULO` +
    `62070503***6304ABCD`

  const qrCode = await gerarQrCode(payloadPix)

  return {
    valor,
    descricao,
    copiaECola: payloadPix,
    qrCode,
    status: 'PENDENTE'
  }
}
