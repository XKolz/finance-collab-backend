const { registerUser, loginUser } = require("../services/authService");
const { errorHandler } = require("../utils/errorHandler");

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    errorHandler(res, error, 400);
  }
};

exports.login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.json(data);
  } catch (error) {
    errorHandler(res, error, 400);
  }
};
