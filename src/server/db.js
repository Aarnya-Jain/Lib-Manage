import express from "express";
import mysql from "mysql2/promise";
import path from "path";


const app = express();
app.use(express.json());
app.use(express.static("../style"));
app.use("/public", express.static("../../public"));



// 1. Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aarnya123", // replace this
  database: "testdb", // create one later in MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Test route
app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT NOW() AS time;");
  res.json({ status: "Server running", time: rows[0].time });
});

// 3. Example API route (insert)
app.post("/users", async (req, res) => {
  const { name, age } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (name, age) VALUES (\"Aarnya_Jain\" , 12)",
    [name, age]
  );
  res.json({ id: result.insertId, name, age });
});

// 4. Example API route (get)
app.get("/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

// 5. Start server
app.listen(3001, () => console.log("Server running on http://localhost:3001"));