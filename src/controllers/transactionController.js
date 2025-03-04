const asyncHandler = require("../utils/asyncHandler");
const successHandler = require("../utils/successHandler");
const { StatusCodes } = require("http-status-codes");
const io = require("../websockets/socket");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../services/transactionService");

// Create a new transaction
exports.createTransaction = asyncHandler(async (req, res) => {
  const { type, amount, category } = req.body;
  if (!type || !amount || !category) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  const transaction = await createTransaction({
    type,
    amount,
    category,
    userId: req.user.id,
  });

  io.emit("transactionUpdated", transaction);
  io.emit("newNotification", {
    message: `A new ${type} transaction was added.`,
  });

  successHandler(
    res,
    "Transaction created successfully",
    transaction,
    StatusCodes.CREATED
  );
});

// Get all transactions
exports.getTransactions = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    minAmount,
    maxAmount,
    page = 1,
    limit = 10,
  } = req.query;

  const result = await getTransactions({
    userId: req.user.id,
    type,
    category,
    minAmount,
    maxAmount,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  successHandler(res, "Transactions retrieved successfully", {
    transactions: result.transactions,
    total: result.totalTransactions,
    page: parseInt(page),
    totalPages: Math.ceil(result.totalTransactions / limit),
  });
});

// Update a transaction
exports.updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, amount, category } = req.body;

  const transaction = await updateTransaction({ id, type, amount, category });

  io.emit("transactionUpdated", transaction);

  successHandler(res, "Transaction updated successfully", transaction);
});

// Delete a transaction
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteTransaction(id);

  io.emit("transactionDeleted", { id });

  successHandler(res, "Transaction deleted successfully", { id });
});
