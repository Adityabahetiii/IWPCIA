const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Database connection (use env variables instead of localhost)
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // e.g. your remote DB host
  user: process.env.DB_USER,     // DB username
  password: process.env.DB_PASS, // DB password
  database: process.env.DB_NAME, // DB name
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
    return;
  }
  console.log("✅ MySQL Connected!");
});

// ✅ Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user_form WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("❌ Error:", err);
        return res.json({ success: false, error: "Database error" });
      }

      if (results.length > 0) {
        res.json({
          success: true,
          message: "Login successful!",
          user: results[0],
        });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

// ✅ Register API
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const sql =
    "INSERT INTO user_form (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting:", err);
      return res.json({ success: false, error: "User may already exist" });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
});

// ❌ REMOVE app.listen() for Vercel
// app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));

// ✅ Instead export the app
module.exports = app;
