import QRCode from "qrcode"

export async function generateQR(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#FF0B0B', // Primary color for QR
        light: '#000000' // Dark background
      }
    })
  } catch (err) {
    console.error(err)
    return ""
  }
}

// [dev-log-sync]: 91d7b0f892770fab