/** Reduz foto de perfil antes do upload (evita 413/502 no cadastro). */
export async function compressImageToDataUrl(
  file: File,
  options: { maxSize?: number; quality?: number; maxBytes?: number } = {}
): Promise<string> {
  const { maxSize = 800, quality = 0.82, maxBytes = 500_000 } = options;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / bitmap.width, maxSize / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Não foi possível processar a imagem');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let q = quality;
  let dataUrl = canvas.toDataURL('image/jpeg', q);

  // data URL ~4/3 do tamanho binário em base64
  while (dataUrl.length > maxBytes * 1.4 && q > 0.45) {
    q -= 0.07;
    dataUrl = canvas.toDataURL('image/jpeg', q);
  }

  return dataUrl;
}
