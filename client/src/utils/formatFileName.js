export const formatFileName = (fileName, maxLength = 30) => {
  if (!fileName || fileName.length <= maxLength) return fileName;

  const extIndex = fileName.lastIndexOf(".");
  const ext = extIndex !== -1 ? fileName.slice(extIndex) : "";
  const maxVisible = maxLength - ext.length - 5; // 5 para " ... "

  const start = fileName.slice(0, Math.ceil(maxVisible / 2));
  const end = fileName.slice(-Math.floor(maxVisible / 2));

  return `${start}...${end}${ext}`;
};
