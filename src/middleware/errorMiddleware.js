const errorHandler = (err, req, res, next) => {
  console.error(err.message || err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
