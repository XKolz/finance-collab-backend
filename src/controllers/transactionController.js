const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const io = require("../websockets/socket");

exports.createTransaction = async (req, res) => {
  const { type, amount, category } = req.body;

  if (!type || !amount || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: { type, amount, category, userId: req.user.id },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.id,
        message: `A new ${type} transaction of $${amount} was added.`,
      },
    });

    io.emit("transactionUpdated", transaction);
    io.emit("newNotification", {
      message: `A new ${type} transaction was added.`,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("❌ Error creating transaction:", error); // Log full error
    res
      .status(400)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  const {
    type,
    category,
    minAmount,
    maxAmount,
    page = 1,
    limit = 10,
  } = req.query;
  const skip = (page - 1) * limit;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        ...(type && { type }),
        ...(category && { category }),
        ...(minAmount && { amount: { gte: parseFloat(minAmount) } }),
        ...(maxAmount && { amount: { lte: parseFloat(maxAmount) } }),
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    // Get total transaction count (for pagination metadata)
    const totalTransactions = await prisma.transaction.count({
      where: {
        userId: req.user.id,
        ...(type && { type }),
        ...(category && { category }),
        ...(minAmount && { amount: { gte: parseFloat(minAmount) } }),
        ...(maxAmount && { amount: { lte: parseFloat(maxAmount) } }),
      },
    });

    res.json({
      transactions,
      total: totalTransactions,
      page: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res.status(400).json({ message: "Error fetching transactions" });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, amount, category } = req.body;
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { type, amount, category },
    });

    io.emit("transactionUpdated", transaction);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Error updating transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({ where: { id } });

    io.emit("transactionDeleted", { id });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting transaction" });
  }
};
