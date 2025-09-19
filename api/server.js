// server.js
const express = require("express");
const mysql = require("mysql2/promise"); // promise-based for async/await
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Replace with your actual frontend URL
app.use(cors({
  origin: "https://your-frontend.vercel.app", 
  methods: ["GET", "POST"],
  credentials: true
}));

// Serve static frontend files (if any)
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ Connect to MySQL using environment variables
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
    });
    console.log("✅ Connected to MySQL!");
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
  }
}
connectDB();

// ✅ Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: "Missing email or password" });

  try {
    const [rows] = await db.execute("SELECT * FROM user_form WHERE email = ?", [email]);
    if (rows.length === 0) return res.json({ success: false, message: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password); // compare hashed passwords

    if (match) {
      // Remove password from response
      delete user.password;
      return res.json({ success: true, message: "Login successful!", user });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// ✅ Register API
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.json({ success: false, message: "Missing fields" });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO user_form (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.json({ success: false, message: "User may already exist or server error" });
  }
});

// ✅ Start server for local testing
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Export app for Vercel Serverless
module.exports = app;
