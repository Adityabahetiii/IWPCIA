const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to Railway MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error("❌ Connection error:", err);
  } else {
    console.log("✅ Connected to Railway MySQL!");
  }
});

// ✅ Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user_form WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) return res.json({ success: false, error: err });
      if (results.length > 0) {
        res.json({ success: true, message: "Login successful!", user: results[0] });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

// ✅ Register API
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const sql = "INSERT INTO user_form (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: "User registered successfully!" });
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
