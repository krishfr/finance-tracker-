// server.js
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

// Middleware Setup
app.use(cors());
app.use(express.json());

// Database Connection Pool Setup
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "finance_tracker",
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
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// =============== AUTH ROUTES ===============

// GET logged-in user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const [rows] = await db
    .promise()
    .query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

  res.json(rows[0]);
});


// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
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

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, role: "USER" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: userId, name, email, role: "USER" },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
        [email]
      );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =============== TRANSACTION ROUTES ===============

// Get all transactions for logged in user
app.get("/api/transactions", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
        [userId]
      );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch data from database." });
  }
});

// Add new transaction
app.post("/api/transactions", authMiddleware, async (req, res) => {
  const { type, amount, category } = req.body;
  const userId = req.user.id;

  if (!type || amount == null || !category) {
    return res
      .status(400)
      .json({ error: "type, amount, category required" });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO transactions (type, amount, category, user_id) VALUES (?, ?, ?, ?)",
        [type, amount, category, userId]
      );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error inserting transaction:", err);
    res.status(500).json({ error: "Failed to insert transaction." });
  }
});

// Delete a transaction of logged in user
app.delete("/api/transactions/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db
      .promise()
      .query(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [id, userId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Database delete failed" });
  }
});

// Default route check
app.get("/", (req, res) => {
  res.json({
    message: "Backend Works! Finance API ready at /api/transactions",
  });
});

// Database connection test and server listener
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connection Successful");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🌐 Frontend should connect to http://localhost:${PORT}`
      );
    });
  }
});
