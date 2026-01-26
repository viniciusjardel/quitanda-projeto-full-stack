import QRCode from 'qrcode'

export async function gerarQrCode(texto) {
  return await QRCode.toDataURL(texto)
}
