USE testdb;

/* ============================
   DUMMY STAFF
   ============================ */

INSERT INTO staff (staff_id, name, phno, email, role, passwd, image) VALUES
(101, 'Arun Kumar', '9876543210', 'arun.k@jiit.ac.in', 'Librarian', 'pass101', '/images/staff/101.jpg'),
(102, 'Meera Sharma', '9898989898', 'meera.s@jiit.ac.in', 'Assistant Librarian', 'pass102', '/images/staff/102.jpg'),
(103, 'Rohan Gupta', '9123456789', 'rohan.g@jiit.ac.in', 'Library Staff', 'pass103', '/images/staff/103.jpg');


/* ============================
   DUMMY STUDENTS
   ============================ */

INSERT INTO student (enrollment_no, name, phno, email, branch, grad_year, image, passwd) VALUES
(2023001, 'Ananya Verma', '9876512345', 'ananya.v@student.jiit.ac.in', 'CSE', 2026, '/images/students/2023001.jpg', 'stu001'),
(2023002, 'Rohit Singh', '7894561230', 'rohit.s@student.jiit.ac.in', 'ECE', 2025, '/images/students/2023002.jpg', 'stu002'),
(2023003, 'Priya Mehta', '9654781234', 'priya.m@student.jiit.ac.in', 'IT', 2026, '/images/students/2023003.jpg', 'stu003'),
(2023004, 'Karan Thakur', '9876547890', 'karan.t@student.jiit.ac.in', 'CSE', 2025, '/images/students/2023004.jpg', 'stu004');


/* ============================
   DUMMY BOOKS
   ============================ */

INSERT INTO books (title, author, isbn, category, shelf_no, quantity) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'Algorithms', 12, 5),
('Operating System Concepts', 'Abraham Silberschatz', '9781119456339', 'Operating Systems', 8, 3),
('Computer Networks', 'Andrew S. Tanenbaum', '9780132126953', 'Networks', 10, 4),
('Database System Concepts', 'Henry Korth', '9780073523323', 'Databases', 6, 2),
('Digital Logic & Design', 'M. Morris Mano', '9780132774208', 'Electronics', 5, 3),
('Engineering Mathematics', 'Erwin Kreyszig', '9788126554239', 'Mathematics', 3, 6);


/* ============================
   DUMMY ISSUE REGISTER
   ============================ */

INSERT INTO issue_register (enrollment_no, staff_id, isbn, issue_date, return_date, return_status) VALUES
-- Ananya
(2023001, 101, '9780262033848', '2025-01-10', '2025-01-20', TRUE),
(2023001, 101, '9780132774208', '2025-11-05', '2025-11-20', TRUE),

-- Rohit
(2023002, 102, '9780132774208', '2025-01-12', NULL, FALSE),
(2023002, 101, '9780262033848', '2025-11-06', '2025-11-21', TRUE),

-- Priya
(2023003, 101, '9788126554239', '2025-11-06', NULL, FALSE),

-- Karan
(2023004, 103, '9781119456339', '2025-01-18', NULL, FALSE),
(2023004, 101, '9780132126953', '2025-11-05', '2025-11-21', TRUE);
