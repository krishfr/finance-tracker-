import express from 'express';
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

const app = express();


dotenv.config();

app.use(cors());
app.use(express.json());
// app.use(mysql());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'finance_tracker'
});

//API Routes

app.get("/api/transactions", (req,res) => {
    db.query('SELECT * FROM transactions', (err, results) => {
        if(err) throw err;
        res.json(results);
    })
})

db.query('SELECT 1', (err, result) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
    } else {
        console.log("✅ MySQL Connection Successful");
    }
});

app.post("/api/transactions", (req, res) => {
         const { type, amount, category } = req.body;
         db.query('INSERT INTO transactions (type, amount, category) VALUES (?, ?, ?)', [type, amount, category], (err, result) => {
             if (err) throw err;
             res.json({ id: result.insertId });
         });
     });
     
app.delete("/api/transactions/:id", (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM transactions WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error("Error deleting transaction: ", err);
            return res.status(500).json({ error: 'Database delete failed' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

app.get("/", (req,res)=>{
    res.json({ message: "Backend Works!"});
});

module.exports = app;