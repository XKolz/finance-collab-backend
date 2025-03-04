const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../utils/asyncHandler");
const successHandler = require("../utils/successHandler");
const { registerUser, loginUser } = require("../services/authService");

// Register user
exports.register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  successHandler(
    res,
    "User registered successfully",
    user,
    StatusCodes.CREATED
  );
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  successHandler(res, "User logged in successfully", data, StatusCodes.OK);
});
