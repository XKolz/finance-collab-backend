const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();
router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.patch("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
