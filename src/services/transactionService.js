const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a transaction
const createTransaction = async ({ type, amount, category, userId }) => {
  const transaction = await prisma.transaction.create({
    data: { type, amount, category, userId },
  });

  await prisma.notification.create({
    data: {
      userId,
      message: `A new ${type} transaction of $${amount} was added.`,
    },
  });

  return transaction;
};

// Get transactions with filters and pagination
const getTransactions = async ({
  userId,
  type,
  category,
  minAmount,
  maxAmount,
  page,
  limit,
}) => {
  const skip = (page - 1) * limit;

  const whereClause = {
    userId,
    ...(type && { type }),
    ...(category && { category }),
    ...(minAmount && { amount: { gte: parseFloat(minAmount) } }),
    ...(maxAmount && { amount: { lte: parseFloat(maxAmount) } }),
  };

  const [transactions, totalTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.count({ where: whereClause }),
  ]);

  return { transactions, totalTransactions };
};

// Update a transaction
const updateTransaction = async ({ id, type, amount, category }) => {
  return prisma.transaction.update({
    where: { id },
    data: { type, amount, category },
  });
};

// Delete a transaction
const deleteTransaction = async (id) => {
  await prisma.transaction.delete({ where: { id } });
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
