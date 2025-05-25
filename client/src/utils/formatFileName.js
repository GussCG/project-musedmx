export const formatFileName = (fileName, maxLength = 20) => {
  if (fileName.length <= maxLength) return fileName;

  const extIndex = fileName.lastIndexOf(".");
  const ext = extIndex !== -1 ? fileName.slice(extIndex) : "";
  const baseLength = maxLength - ext.length - 3; // 3 = "..."
  const base = fileName.slice(0, baseLength);

  return `${base}...${ext}`;
};
