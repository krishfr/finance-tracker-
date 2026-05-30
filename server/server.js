import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET_KEY";
console.log("SERVER FILE LOADED");
app.use(cors());
app.use(express.json());

// DB
// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: process.env.DB_PASSWORD,
//   database: "finance_tracker",
// });

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "finance_tracker",
});
// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const [existing] = await db
    .promise()
    .query("SELECT id FROM users WHERE email = ?", [email]);

  if (existing.length > 0) {
    return res.status(400).json({ message: "Email already used" });
  }

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db
    .promise()
    .query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hash]
    );

  const token = jwt.sign(
    { id: result.insertId, role: "USER" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: result.insertId, name, email, role: "USER" },
  });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db
    .promise()
    .query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
// GET TRANSACTIONS
app.get("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, type, amount, category, description, created_at
       FROM transactions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
  console.error("GET /api/transactions ERROR:", error);
  res.status(500).json({
    message: "Failed to fetch transactions",
    error: error.message
  });
}
});

// ADD TRANSACTION
app.post("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [result] = await db.promise().query(
      `INSERT INTO transactions
       (user_id, type, amount, category, description)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        type,
        amount,
        category,
        description || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Transaction added"
    });
  } catch (error) {
  console.error("POST /api/transactions ERROR:", error);
  res.status(500).json({
    message: "Failed to add transaction",
    error: error.message
  });
}
});

// DELETE TRANSACTION
app.delete("/api/transactions/:id", authMiddleware, async (req, res) => {
  try {
    const transactionId = req.params.id;

    const [result] = await db.promise().query(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.json({
      message: "Transaction deleted successfully"
    });

  } catch (error) {

    console.error("DELETE /api/transactions ERROR:", error);

    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message
    });
  }
});

// START
// db.query("SELECT 1", (err) => {
//   if (err) {
//     console.log("DB failed");
//   } else {
//     app.listen(PORT, () => {
//       console.log(`Server running on ${PORT}`);
//     });
//   }
// });
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("DB FAILED:", err);
  } else {
    console.log("DB CONNECTED");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  }
});