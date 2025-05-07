export const buildImage = (museoActual) => {
  if (!museoActual.img?.data) return "";

  const byteArray = new Uint8Array(museoActual.img.data);

  const isPNG = byteArray[0] === 0x89 && byteArray[1] === 0x50;
  const isJPG = byteArray[0] === 0xff && byteArray[1] === 0xd8;

  let mimeType = isPNG ? "image/png" : isJPG ? "image/jpeg" : "";

  const blob = new Blob([byteArray], { type: mimeType });
  const imageURL = URL.createObjectURL(blob);

  return imageURL;
};

export const buildImageGaleria = (imagen) => {
  if (!imagen.gal_foto?.data) return "";

  const byteArray = new Uint8Array(imagen.gal_foto.data);
  const isPNG = byteArray[0] === 0x89 && byteArray[1] === 0x50;
  const isJPG = byteArray[0] === 0xff && byteArray[1] === 0xd8;

  let mimeType = isPNG ? "image/png" : isJPG ? "image/jpeg" : "";

  const blob = new Blob([byteArray], { type: mimeType });
  const imageURL = URL.createObjectURL(blob);

  return imageURL;
};
