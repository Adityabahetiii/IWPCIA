const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Database connection (your phpMyAdmin DB)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "",   // your MySQL password
  database: "user_db" // your phpMyAdmin DB
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ✅ Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM user_form WHERE email = ? AND password = ?", 
    [email, password], 
    (err, results) => {
      if (err) {
        console.error("❌ Error:", err);
        return res.json({ success: false, error: "Database error" });
      }

      if (results.length > 0) {
        res.json({ success: true, message: "Login successful!", user: results[0] });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    });
});

// ✅ Register API
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  // Insert into user_form table
  const sql = "INSERT INTO user_form (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting:", err);
      return res.json({ success: false, error: "User may already exist" });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
});


app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
