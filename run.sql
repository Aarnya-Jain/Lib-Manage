/* ============================
   LIBRARY MANAGEMENT SYSTEM
   FULL DATABASE SCHEMA + FUNCTIONS + PROCEDURES
   ============================ */

DROP DATABASE IF EXISTS testdb;
CREATE DATABASE testdb;
USE testdb;

/* ============================
   1. TABLE CREATION
   ============================ */

CREATE TABLE student(
    enrollment_no BIGINT PRIMARY KEY,
    name VARCHAR(200),
    phno VARCHAR(15),
    email VARCHAR(200),
    branch VARCHAR(50),
    grad_year INT,
    image VARCHAR(255) DEFAULT NULL,
    passwd VARCHAR(50)
);

CREATE TABLE staff(
    staff_id INT PRIMARY KEY,
    name VARCHAR(200),
    phno VARCHAR(15),
    email VARCHAR(200),
    role VARCHAR(40),
    passwd VARCHAR(50),
    image VARCHAR(255) DEFAULT NULL
);

CREATE TABLE books(
    title VARCHAR(200),
    author VARCHAR(100),
    isbn VARCHAR(13) PRIMARY KEY,
    category VARCHAR(100),
    shelf_no INT,
    quantity INT
);

CREATE TABLE issue_register(
    enrollment_no BIGINT,
    staff_id INT,
    isbn VARCHAR(13),
    issue_date DATE,
    return_date DATE,
    return_status BOOLEAN,
    FOREIGN KEY(enrollment_no) REFERENCES student(enrollment_no),
    FOREIGN KEY(staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY(isbn) REFERENCES books(isbn)
);

/* ============================
   2. LOGIN PROCEDURES
   ============================ */

DELIMITER //

CREATE PROCEDURE StudentLogin (
    IN p_username BIGINT,
    IN p_password VARCHAR(50)
)
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM student
    WHERE enrollment_no = p_username
      AND passwd = p_password;

    SELECT (v_count > 0) AS success;
END //

CREATE PROCEDURE staffLogin (
    IN p_username INT,
    IN p_password VARCHAR(50)
)
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM staff
    WHERE staff_id = p_username
      AND passwd = p_password;

    SELECT (v_count > 0) AS success;
END //

DELIMITER ;

/* ============================
   3. ISSUE BOOK PROCEDURE
   ============================ */

DELIMITER //

CREATE PROCEDURE issue_book(
    IN stud_username BIGINT,
    IN staff_username INT,
    IN p_isbn VARCHAR(13)
)

proc: BEGIN
    DECLARE student_exists INT DEFAULT 0;
    DECLARE staff_exists INT DEFAULT 0;
    DECLARE book_available INT DEFAULT 0;

    SELECT COUNT(*) INTO student_exists FROM student WHERE enrollment_no = stud_username;
    IF student_exists = 0 THEN SELECT 0 AS success; LEAVE proc; END IF;

    SELECT COUNT(*) INTO staff_exists FROM staff WHERE staff_id = staff_username;
    IF staff_exists = 0 THEN SELECT 3 AS success; LEAVE proc; END IF;

    SELECT COUNT(*) INTO book_available FROM books WHERE isbn = p_isbn AND quantity > 0;
    IF book_available = 0 THEN SELECT 2 AS success; LEAVE proc; END IF;

    UPDATE books SET quantity = quantity - 1 WHERE isbn = p_isbn;

    INSERT INTO issue_register(enrollment_no, staff_id, isbn, issue_date, return_date, return_status)
    VALUES (stud_username, staff_username, p_isbn, CURDATE(), NULL, FALSE);

    SELECT 1 AS success;
END //

DELIMITER ;

/* ============================
   4. RETURN BOOK PROCEDURE
   ============================ */

DELIMITER //

CREATE PROCEDURE return_book(
    IN stud_username BIGINT,
    IN staff_username INT,
    IN p_isbn VARCHAR(13)
)
return_book:BEGIN
    DECLARE student_exists INT DEFAULT 0;
    DECLARE staff_exists INT DEFAULT 0;
    DECLARE book_exists INT DEFAULT 0;
    DECLARE issue_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO student_exists FROM student WHERE enrollment_no = stud_username;
    IF student_exists = 0 THEN SELECT 0 AS success; LEAVE return_book; END IF;

    SELECT COUNT(*) INTO staff_exists FROM staff WHERE staff_id = staff_username;
    IF staff_exists = 0 THEN SELECT 3 AS success; LEAVE return_book; END IF;

    SELECT COUNT(*) INTO book_exists FROM books WHERE isbn = p_isbn;
    IF book_exists = 0 THEN SELECT 2 AS success; LEAVE return_book; END IF;

    SELECT COUNT(*) INTO issue_exists
    FROM issue_register
    WHERE enrollment_no = stud_username
      AND isbn = p_isbn
      AND return_date IS NULL;

    IF issue_exists = 0 THEN SELECT 4 AS success; LEAVE return_book; END IF;

    UPDATE issue_register
    SET return_date = CURDATE(),
        return_status = TRUE
    WHERE enrollment_no = stud_username
      AND isbn = p_isbn
      AND return_date IS NULL;

    UPDATE books SET quantity = quantity + 1 WHERE isbn = p_isbn;

    SELECT 1 AS success;
END //

DELIMITER ;

/* ============================
   5. REGISTER STUDENT FUNCTION
   ============================ */

DELIMITER //

CREATE FUNCTION register_student(
    enr BIGINT,
    sname VARCHAR(200),
    phn VARCHAR(15),
    email VARCHAR(200),
    branch VARCHAR(50),
    grad_year INT,
    img VARCHAR(255),
    passwd VARCHAR(50),
    staf_id INT
)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE staff_count INT DEFAULT 0;
    DECLARE enr_count INT DEFAULT 0;

    SELECT COUNT(*) INTO staff_count FROM staff WHERE staff_id = staf_id;
    IF staff_count = 0 THEN RETURN 3; END IF;

    SELECT COUNT(*) INTO enr_count FROM student WHERE enrollment_no = enr;
    IF enr_count = 1 THEN RETURN 2; END IF;

    INSERT INTO student VALUES (enr, sname, phn, email, branch, grad_year, img, passwd);

    RETURN 1;
END //

DELIMITER ;

/* ============================
   6. REGISTER STAFF FUNCTION
   ============================ */

DELIMITER $$

CREATE FUNCTION register_staff(
    p_staff_id INT,
    p_name VARCHAR(200),
    p_phno VARCHAR(15),
    p_email VARCHAR(200),
    p_role VARCHAR(40),
    p_image VARCHAR(255),
    p_passwd VARCHAR(50)
)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE already_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO already_exists FROM staff WHERE staff_id = p_staff_id;
    IF already_exists > 0 THEN RETURN 2; END IF;

    INSERT INTO staff VALUES (p_staff_id, p_name, p_phno, p_email, p_role, p_passwd, p_image);

    RETURN 1;
END$$

DELIMITER ;

/* ============================
   7. ADD BOOK FUNCTION
   ============================ */

DELIMITER //

CREATE FUNCTION add_book(
    titl VARCHAR(200),
    auth VARCHAR(100),
    isb VARCHAR(13),
    categry VARCHAR(100),
    shelf INT,
    qty INT
)

RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE found_isbn INT DEFAULT 0;

    SELECT COUNT(*) INTO found_isbn FROM books WHERE isbn = isb;

    IF found_isbn = 1 THEN
        UPDATE books SET quantity = quantity + qty WHERE isbn = isb;
        RETURN 2;
    END IF;

    INSERT INTO books VALUES (titl, auth, isb, categry, shelf, qty);

    RETURN 1;
END //

DELIMITER ;

/* ============================
   8. DELETE STUDENT
   ============================ */

DELIMITER //

CREATE FUNCTION delete_student(p_enroll BIGINT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE exists_count INT DEFAULT 0;
    DECLARE used INT DEFAULT 0;

    SELECT COUNT(*) INTO exists_count FROM student WHERE enrollment_no = p_enroll;
    IF exists_count = 0 THEN RETURN 2; END IF;

    SELECT COUNT(*) INTO used FROM issue_register WHERE enrollment_no = p_enroll;
    IF used > 0 THEN RETURN 3; END IF;

    DELETE FROM student WHERE enrollment_no = p_enroll;

    RETURN 1;
END //

DELIMITER ;

/* ============================
   9. DELETE STAFF
   ============================ */

DELIMITER //

CREATE FUNCTION delete_staff(stid INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE staff_exists INT DEFAULT 0;
    DECLARE used INT DEFAULT 0;

    SELECT COUNT(*) INTO staff_exists FROM staff WHERE staff_id = stid;
    IF staff_exists = 0 THEN RETURN 2; END IF;

    SELECT COUNT(*) INTO used FROM issue_register WHERE staff_id = stid;
    IF used > 0 THEN RETURN 3; END IF;

    DELETE FROM staff WHERE staff_id = stid;

    RETURN 1;
END //

DELIMITER ;

/* ============================
   10. DELETE BOOK
   ============================ */

DELIMITER //

CREATE FUNCTION delete_book(p_isbn VARCHAR(13))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE exists_count INT DEFAULT 0;
    DECLARE history_count INT DEFAULT 0;
    DECLARE active_issues INT DEFAULT 0;

    SELECT COUNT(*) INTO exists_count FROM books WHERE isbn = p_isbn;
    IF exists_count = 0 THEN RETURN 2; END IF;

    SELECT COUNT(*) INTO active_issues FROM issue_register WHERE isbn = p_isbn AND return_date IS NULL;
    IF active_issues > 0 THEN RETURN 3; END IF;

    SELECT COUNT(*) INTO history_count FROM issue_register WHERE isbn = p_isbn;
    IF history_count > 0 THEN RETURN 4; END IF;

    DELETE FROM books WHERE isbn = p_isbn;

    RETURN 1;
END //

DELIMITER ;

/* ============================
   11. GET ISSUE HISTORY
   ============================ */

DELIMITER //

CREATE PROCEDURE get_issue_history()
BEGIN
    SELECT
        ir.enrollment_no,
        s.name AS student_name,
        ir.staff_id,
        st.name AS staff_name,
        ir.isbn,
        b.title AS book_title,
        ir.issue_date,
        ir.return_date,
        ir.return_status
    FROM issue_register ir
    JOIN student s ON ir.enrollment_no = s.enrollment_no
    JOIN books b ON ir.isbn = b.isbn
    JOIN staff st ON ir.staff_id = st.staff_id
    ORDER BY ir.issue_date DESC;
END //

DELIMITER ;

/* ============================
   12. SEARCH ISSUE HISTORY
   ============================ */

DELIMITER //

CREATE PROCEDURE search_issue_history(
    IN column_name VARCHAR(50),
    IN search_value VARCHAR(100)
)
BEGIN
    DECLARE real_col VARCHAR(100);

    SET real_col = (
        CASE column_name
            WHEN 'enrollment_no' THEN 'ir.enrollment_no'
            WHEN 'student_name' THEN 's.name'
            WHEN 'staff_id' THEN 'ir.staff_id'
            WHEN 'staff_name' THEN 'st.name'
            WHEN 'isbn' THEN 'ir.isbn'
            WHEN 'book_title' THEN 'b.title'
            WHEN 'issue_date' THEN 'ir.issue_date'
            WHEN 'return_date' THEN 'ir.return_date'
            WHEN 'return_status' THEN 'ir.return_status'
            ELSE NULL
        END
    );

    IF real_col IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid column name';
    END IF;

    SET @query = CONCAT('
        SELECT
            ir.enrollment_no,
            s.name AS student_name,
            st.name AS staff_name,
            ir.isbn,
            b.title AS book_title,
            ir.issue_date,
            ir.return_date,
            ir.return_status
        FROM issue_register ir
        JOIN student s ON ir.enrollment_no = s.enrollment_no
        JOIN staff st ON ir.staff_id = st.staff_id
        JOIN books b ON ir.isbn = b.isbn
        WHERE ', real_col, ' LIKE ?
    ');

    PREPARE stmt FROM @query;
    SET @val = CONCAT("%", search_value, "%");
    EXECUTE stmt USING @val;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;
