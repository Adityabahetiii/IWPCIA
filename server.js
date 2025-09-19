const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to Railway MySQL using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Required for Railway
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to Railway MySQL!");
  }
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM user_form WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) return res.json({ success: false, error: "Database error" });

    if (results.length > 0) {
      res.json({ success: true, message: "Login successful!", user: results[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// Register API
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const query = "INSERT INTO user_form (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, password], (err, result) => {
    if (err) return res.json({ success: false, error: "User may already exist" });

    res.json({ success: true, message: "User registered successfully!" });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
