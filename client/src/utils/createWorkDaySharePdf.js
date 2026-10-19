const PDF_PAGE_WIDTH = 540;

export function getPngDimensions(blobBytes) {
  const bytes = blobBytes instanceof Uint8Array
    ? blobBytes
    : new Uint8Array(blobBytes);
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (
    bytes.length < 24 ||
    signature.some((value, index) => bytes[index] !== value)
  ) {
    throw new Error("No se pudo preparar una de las páginas del PDF");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    width: view.getUint32(16),
    height: view.getUint32(20),
  };
}

export async function createWorkDaySharePdf(imageBlobs = []) {
  if (imageBlobs.length === 0) {
    throw new Error("No hay páginas para generar el PDF");
  }

  const { jsPDF } = await import("jspdf");
  const pages = await Promise.all(imageBlobs.map(async (blob) => {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const dimensions = getPngDimensions(bytes);
    return {
      bytes,
      height: PDF_PAGE_WIDTH * dimensions.height / dimensions.width,
    };
  }));
  const firstPage = pages[0];
  const document = new jsPDF({
    unit: "pt",
    format: [PDF_PAGE_WIDTH, firstPage.height],
    orientation: "portrait",
    compress: true,
  });

  pages.forEach((page, index) => {
    if (index > 0) {
      document.addPage([PDF_PAGE_WIDTH, page.height], "portrait");
    }
    document.addImage(
      page.bytes,
      "PNG",
      0,
      0,
      PDF_PAGE_WIDTH,
      page.height,
      undefined,
      "FAST"
    );
  });

  return document.output("blob");
}
