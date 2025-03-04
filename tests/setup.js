require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async () => {
  console.log("🛠 Setting up test database...");

  // Clear all data before tests
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Test database ready!");
};
