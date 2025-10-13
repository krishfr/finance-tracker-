import express from 'express';
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

const app = express();

// Set the port. Default to 5000 if not specified in .env
const PORT = process.env.PORT || 5000; 

dotenv.config();

// Middleware Setup
app.use(cors()); // Enables cross-origin requests from your frontend
app.use(express.json()); // Allows parsing JSON data from the frontend (POST/DELETE bodies)

// Database Connection Pool Setup
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // Loaded from the .env file
    database: 'finance_tracker'
});

// --- API Routes ---

// 1. GET all transactions
app.get("/api/transactions", (req,res) => {
    // Select all fields, including the primary key 'id'
    db.query('SELECT * FROM transactions', (err, results) => {
        if(err) {
            console.error("Error fetching transactions:", err);
            return res.status(500).json({ error: "Failed to fetch data from database." });
        }
        res.json(results);
    });
});

// 2. POST (Add) a new transaction
app.post("/api/transactions", (req, res) => {
     const { type, amount, category } = req.body;
     // Note: We intentionally skip 'date' here, letting the SQL TIMESTAMP default fill it.
     db.query('INSERT INTO transactions (type, amount, category) VALUES (?, ?, ?)', 
         [type, amount, category], 
         (err, result) => {
             if (err) {
                 console.error("Error inserting transaction:", err);
                 return res.status(500).json({ error: "Failed to insert transaction." });
             }
             // CRITICAL: Return the ID so the frontend can use it as a React key
             res.json({ id: result.insertId }); 
         }
     );
});

// 3. DELETE a transaction
app.delete("/api/transactions/:id", (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM transactions WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error("Error deleting transaction: ", err);
            return res.status(500).json({ error: 'Database delete failed' });
        }
        // Check if a row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

// Default route check
app.get("/", (req,res)=>{
    res.json({ message: "Backend Works! Finance API ready at /api/transactions" });
});


// Database connection test and server listener
db.query('SELECT 1', (err, result) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    } else {
        console.log("✅ MySQL Connection Successful");
        
        // CRITICAL FIX: Start the server listener only after DB connection is confirmed
        if(process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Frontend should connect to http://localhost:${PORT}`);
        })};
    }
});

module.exports = app; // Omit this line if running directly with 'node server.js'
