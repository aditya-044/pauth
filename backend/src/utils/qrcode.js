import QRCode from "qrcode";

async function generateQRCodeDataURL(text) {
  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      },
      errorCorrectionLevel: "H"
    });
    return dataURL;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
}

async function generateQRCodeBase64(text) {
  try {
    const base64 = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H"
    });
    return base64.replace(
      /^data:image\/png;base64,/,
      ""
    );
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
}

export {
  generateQRCodeDataURL,
  generateQRCodeBase64
};
