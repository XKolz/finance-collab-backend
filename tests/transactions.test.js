const request = require("supertest");
const { app, server } = require("../src/server"); // Import app, not server
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("💰 Transactions Tests", () => {
  let token;
  let transactionId;

  beforeAll(async () => {
    await prisma.transaction.deleteMany({});
    await prisma.user.deleteMany({});

    // Register and login a user to get a token
    await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "test123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "janedoe@example.com",
      password: "test123",
    });

    token = res.body.token;
  });

  it("✅ Should create a transaction", async () => {
    const res = await request(app)
      .post("/api/transactions/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "income",
        amount: 500,
        category: "Freelancing",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    transactionId = res.body.id;
  });

  it("✅ Should get all transactions", async () => {
    const res = await request(app)
      .get("/api/transactions/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.transactions.length).toBeGreaterThan(0);
  });

  it("✅ Should update a transaction", async () => {
    const res = await request(app)
      .patch(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "expense",
        amount: 300,
        category: "Shopping",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(300);
  });

  it("✅ Should delete a transaction", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Transaction deleted");
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close(); // Close the server after tests
  });
});
