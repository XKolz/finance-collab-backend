const { StatusCodes } = require("http-status-codes");

const successHandler = (
  res,
  message,
  data = null,
  statusCode = StatusCodes.OK
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = successHandler;
