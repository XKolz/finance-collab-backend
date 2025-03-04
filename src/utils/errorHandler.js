exports.errorHandler = (res, error, statusCode = 500) => {
  console.error(error.message || error);
  res.status(statusCode).json({ message: error.message || "Server error" });
};
