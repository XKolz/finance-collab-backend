# **Finance Collab Backend - README**

🚀 **A real-time collaborative financial management backend** using **Express.js, Prisma, PostgreSQL, Socket.IO, and JWT authentication**.

---

## 📌 **Project Overview**

This is a **real-time finance management API** where multiple users can:

- 📌 **Sign up & log in** securely with JWT authentication.
- 📌 **Create, update, delete, and view transactions.**
- 📌 **Get real-time updates** when any transaction changes.
- 📌 **Receive notifications** when transactions are modified.
- 📌 **Filter transactions** based on type, category, and amount.
- 📌 **Handle multiple users** collaborating in real-time.

---

## 🚀 **Tech Stack**

| Technology             | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| **Express.js**         | Backend framework for APIs               |
| **Prisma ORM**         | Database ORM for PostgreSQL              |
| **PostgreSQL**         | Relational database                      |
| **Socket.IO**          | Real-time WebSockets for instant updates |
| **JWT (jsonwebtoken)** | Authentication & Authorization           |
| **Jest & Supertest**   | Unit testing                             |
| **Nodemon**            | Development auto-restart                 |
| **Dotenv**             | Environment variable management          |

---

## 📂 **Project Structure**

```
/finance-collab-backend
 ├── src/
 │   ├── controllers/      # API logic (auth & transactions)
 │   ├── middleware/       # Auth middleware (JWT)
 │   ├── models/           # Prisma models (DB schema)
 │   ├── routes/           # Express API routes
 │   ├── services/         # Business logic functions
 │   ├── websockets/       # WebSocket logic (Socket.IO)
 │   ├── app.js            # Express app setup
 │   ├── server.js         # Server entry point
 ├── tests/                # Jest test cases
 ├── prisma/
 │   ├── schema.prisma     # Database schema
 ├── .env                  # Environment variables
 ├── jest.config.js        # Jest configuration
 ├── package.json          # Dependencies & scripts
 ├── README.md             # Documentation
```

---

## 🔧 **Installation & Setup**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/finance-collab-backend.git
cd finance-collab-backend
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file in the root directory and add the following:

```
# PostgreSQL Database
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"

# Authentication
JWT_SECRET="your_secret_key"

# Server Port
PORT=5000
```

🚨 **Replace `user`, `password`, and `finance_db` with your actual PostgreSQL credentials.**

### **4️⃣ Set Up Database**

```sh
npx prisma migrate dev --name init
npx prisma generate
```

### **5️⃣ Start the Server**

```sh
npm run dev
```

### POSTMAN DOC URL: https://documenter.getpostman.com/view/23652017/2sAYdkFoKB

Your API should now be running on **`http://localhost:5000`**.

---

## 📡 **API Endpoints**

### 🔐 **Authentication Endpoints**

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| `POST` | `/api/auth/register` | Register a new user          |
| `POST` | `/api/auth/login`    | Login a user & get JWT token |

#### 📌 **Register a User**

**Request:**

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": ""
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

#### 📌 **Login a User**

**Request:**

```json
POST /api/auth/login
{
  "email": "johndoe@example.com",
  "password": ""
}
```

**Response:**

```json
{
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

💡 **Use the token in `Authorization: Bearer <TOKEN>` for protected routes.**

---

### 💰 **Transaction Endpoints**

| Method   | Endpoint                | Description                                  |
| -------- | ----------------------- | -------------------------------------------- |
| `POST`   | `/api/transactions/`    | Create a new transaction                     |
| `GET`    | `/api/transactions/`    | Get transactions (with filters & pagination) |
| `PATCH`  | `/api/transactions/:id` | Update a transaction                         |
| `DELETE` | `/api/transactions/:id` | Delete a transaction                         |

#### 📌 **Create a Transaction**

```json
POST /api/transactions/
Authorization: Bearer <JWT_TOKEN>
{
  "type": "income",
  "amount": 1000,
  "category": "Salary"
}
```

**Response:**

```json
{
  "id": "transaction_id",
  "type": "income",
  "amount": 1000,
  "category": "Salary",
  "userId": "user_id"
}
```

#### 📌 **Get Transactions (with Filters & Pagination)**

```http
GET /api/transactions?page=1&limit=5&type=income&category=Salary
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "transactions": [...],
  "total": 15,
  "page": 1,
  "totalPages": 3
}
```

---

## 🔄 **Real-Time WebSocket Events**

| Event                | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `transactionUpdated` | Broadcasts when a transaction is created/updated/deleted |
| `newNotification`    | Sends real-time notifications to users                   |

📌 **Example WebSocket Connection**

```js
const socket = io("http://localhost:5000");

socket.on("transactionUpdated", (data) => {
  console.log("New transaction update:", data);
});

socket.on("newNotification", (msg) => {
  console.log("Notification:", msg);
});
```

---

## 🔥 **Testing**

### **Run Unit Tests**

```sh
npm test
```

### **Test Coverage**

| Feature               | Tests                                                |
| --------------------- | ---------------------------------------------------- |
| **Authentication**    | ✅ Register & login tests                            |
| **Transactions**      | ✅ Create, update, delete, and retrieve transactions |
| **Database Handling** | ✅ Prisma test database setup                        |

---

## 🚀 **Deployment**

### **Deploy on Railway**

1. **Login to Railway**
   ```sh
   railway login
   ```
2. **Create a New Project**
   ```sh
   railway init
   ```
3. **Deploy**
   ```sh
   railway up
   ```

### **Deploy on Render**

1. **Create a new Render project.**
2. **Add PostgreSQL Database.**
3. **Set up environment variables.**
4. **Deploy!**

---

## 🎯 **Final Summary**

✅ **JWT Authentication**  
✅ **Real-time WebSocket updates**  
✅ **PostgreSQL + Prisma for efficient data handling**  
✅ **Unit testing with Jest**  
✅ **Filtering & pagination for transactions**  
✅ **Deployment-ready on Railway/Render**

---

## 🎉 **Contributing**

👨‍💻 Want to improve this project? Feel free to fork and submit a pull request.

---

## 🤝 **Need Help?**

📧 Email: `samuelayo61@gmail.com`  
🌍 GitHub: [Your Repository](https://github.com/XKolz/finance-collab-backend)

🚀 **Happy coding!** 🔥🔥🔥

<!--  -->

## We will get back to this soon...Thanks

npm dep & others
npm init -y
npm install express dotenv cors jsonwebtoken bcryptjs socket.io prisma @prisma/client
npm install http-status-codes
npm install --save-dev nodemon jest supertest
wscat -c "ws://localhost:5000/socket.io/?EIO=4&transport=websocket"
