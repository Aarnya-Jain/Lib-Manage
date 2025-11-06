import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(express.static("../style"));

app.use("/public", express.static("../../public"));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aarnya123",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// route to fetch all book data
app.get("/books", async (req, res) => {
  try {
        const [rows] = await pool.query("SELECT * FROM books");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search book by column
app.get("/books/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["title", "author", "isbn", "category"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM books WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search student by column
app.get("/student/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["enrollment_no", "name", "phno", "email","branch","grad_year"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM student WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to search staff by column
app.get("/staff/search", async (req, res) => {
    try {
        const { column, value } = req.query;

        const allowedColumns = ["staff_id", "name", "phno", "email","role"];
        if (!allowedColumns.includes(column.toLowerCase())) {
            return res.status(400).json({ error: "Invalid column" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM staff WHERE ${column} LIKE ?`,
            [`%${value}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// login route for student
app.get("/login/student", async (req, res) => {
  try {
    const { username, password } = req.query;

    // checking that username is an integer only
    if (!/^\d+$/.test(username)) {
      return res.status(400).json({ error: "Username must be a number" });
    }

    const [rows] = await pool.query("CALL StudentLogin(?, ?)", [username, password]);

    const result = rows[0][0];
    if (result.success === 1) {
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// login route for staff
app.get("/login/staff", async (req, res) => {
  try {
    const { username, password } = req.query;

    // checking that username is an integer only
    if (!/^\d+$/.test(username)) {
      return res.status(400).json({ error: "Username must be a number" });
    }

    const [rows] = await pool.query("CALL staffLogin(?, ?)", [username, password]);

    const result = rows[0][0];
    if (result.success === 1) {
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// issue book to student by staff
app.post("/issue", async (req, res) => {
  try {
    const { student_enroll, isbn, staff_id } = req.body;

    if (!/^\d+$/.test(student_enroll))
      return res.status(400).json({ error: "Student enrollment must be a number" });

    if (!/^\d+$/.test(staff_id))
      return res.status(400).json({ error: "Staff ID must be a number" });

    const [rows] = await pool.query("CALL issue_book(?, ?, ?)", [
      student_enroll,
      staff_id,
      isbn
    ]);

    const result = rows[0][0];

    if (result.success === 1) {
      res.json({ message: "Book issued successfully" });
    } else {
      res.status(400).json({ message: "Issue failed" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// route to fetch all student data by enrollment
app.get("/info/student", async (req, res) => {

  const { student_enroll } = req.query;

  try {
        const [rows] = await pool.query(`SELECT * FROM student WHERE enrollment_no = ${student_enroll}`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all student's data
app.get("/info/students", async (req, res) => {

  try {
        const [rows] = await pool.query(`SELECT * FROM student`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all staff data by staff_id
app.get("/info/staff", async (req, res) => {

  const { staff_id } = req.query;

  try {
        const [rows] = await pool.query(`SELECT * FROM staff WHERE staff_id = ${staff_id}`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all staff's data
app.get("/info/staffs", async (req, res) => {

  try {
        const [rows] = await pool.query(`SELECT * FROM staff`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// route to fetch all student issue history data
app.get("/info/student/issue_history", async (req, res) => {

  const { student_enroll } = req.query;

  try {
        const [rows] = await pool.query("CALL display_History(?)", [student_enroll]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});





app.listen(3001, () => console.log("Server running on http://localhost:3001"));