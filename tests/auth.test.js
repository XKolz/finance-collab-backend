const request = require("supertest");
const { app, server } = require("../src/server"); // Import app, not server
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("🔐 Authentication Tests", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear test users
  });

  it("✅ Should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "test123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("✅ Should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "johndoe@example.com",
      password: "test123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close(); // Close the server to prevent Jest from hanging
  });
});
