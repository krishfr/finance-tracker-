// backend/routes/transactionRoutes.js
const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create transaction
router.post("/", async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [type, amount, category, description || "", date || new Date(), userId]
    );

    res.json({
      id: result.insertId,
      type,
      amount,
      category,
      description,
      date,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all transactions for logged user
router.get("/", async (req, res) => {
  const userId = req.user.id;
  const { type, category, sort } = req.query;

  let sql = "SELECT * FROM transactions WHERE user_id = ?";
  const params = [userId];

  if (type && type !== "All") {
    sql += " AND type = ?";
    params.push(type);
  }
  if (category && category !== "All") {
    sql += " AND category = ?";
    params.push(category);
  }

  if (sort === "oldest") {
    sql += " ORDER BY date ASC";
  } else {
    sql += " ORDER BY date DESC";
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    await pool.query(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
