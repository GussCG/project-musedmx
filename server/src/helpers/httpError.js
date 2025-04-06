export const handleHttpError = (res, errorCode, error) => {
  console.error(error);
  res.status(500).json({
    error: true,
    message: errorCode,
    details: error.message,
  });
};

export const createError = (res, errorCode, error) => {
  console.error(error);
  res.status(400).json({
    error: true,
    message: errorCode,
    details: error.message,
  });
};
