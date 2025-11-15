// Navigate back to staff Dashbooard
let back_btn = document.querySelector('#back');
back_btn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "/staff.html";
});

// Show issue modal
document.getElementById('issue_btn').addEventListener('click', () => {
    document.getElementById('issueBookModal').classList.add('active');
});

// Close modal when clicking close button
document.getElementById('issueModalClose').addEventListener('click', () => {
    const form = document.querySelector("#issueBookForm");
    form.reset();
    document.getElementById('issueBookModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('issueBookModal').addEventListener('click', (e) => {
    if (e.target.id === 'issueBookModal') {
        const form = document.querySelector("#issueBookForm");
        form.reset();
        document.getElementById('issueBookModal').classList.remove('active');
    }
});

// book issuing logic
let issue_submit_button = document.querySelector('#submit_button_issue');

issue_submit_button.addEventListener('click', async (event) => {
    event.preventDefault();

    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let student_enroll = document.querySelector('#issue_enr').value.trim();
    let isbn = document.querySelector('#issue_isbn').value.trim();
    let staff_id = localStorage.getItem("curr_user");

    console.log("Issuing for ", student_enroll, staff_id, isbn);

    const res = await fetch("/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_enroll, staff_id, isbn })
    });

    const data = await res.json().catch(() => null);

    console.log(data);

    if (res.ok) {
        showSuccessAlert(data.message);
        await delay();
        form.reset();
        location.reload();
    } else {
        showErrorAlert(data.error || data.message || "Unknown error");
    }
});


document.addEventListener("DOMContentLoaded", () => {

// displaying all data for issue history
fetch(`/info/issue_history`)
        .then(res => res.json())
        .then(data => {

            // visible the table
            const table = document.getElementById("issuetable");
            table.style.visibility="visible";

            const container = document.querySelector("#issuetable");

            container.innerHTML = data.length === 0
            ? `
                <tr>
                    <td colspan="6" style="
                        text-align:center;
                        padding:20px;
                        font-size:20px;
                        font-weight:600;
                        border-radius:10px;
                    ">No Issue History found.</td>
                </tr>
              `
            : `
                <tr id="first-row">

                <th>Enrollment No.</th>
                <th>Student's Name</th>
                <th>Staff's Name</th>
                <th>ISBN</th>
                <th>Book Title</th>
                <th>Issue_Date</th>
                <th>Return_date</th>
                <th>Return Status</th>

                </tr>
                ${
                    data.map(book => `
                    <tr>
                        <td>${book.enrollment_no}</td>
                        <td>${book.student_name}</td>
                        <td>${book.staff_name}</td>
                        <td>${book.isbn}</td>
                        <td>${book.book_title}</td>
                        <td>${book.issue_date ? book.issue_date.split("T")[0] : "-"}</td>
                        <td>${book.return_date ? book.return_date.split("T")[0] : "-"}</td>
                        <td>${book.return_status ? "Returned" : "Issued"}</td>
                    </tr>
                `).join("")
            }
                `;

        });

})


// searching by column
let searchbtn = document.querySelector("#searchbtn");
let table = document.querySelector("table");

searchbtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const column = document.querySelector("#search_by").value;
    const value = document.querySelector("#search").value;


    console.log("Searching column:", column, "value:", value);

    table.style.visibility = "visible";

    const res = await fetch(`/issue_history/search?column=${column}&value=${encodeURIComponent(value)}`);
    const data = await res.json();


    if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return; // stop here if data is not an array
    }

    const container = document.getElementById("issuetable");
    container.innerHTML = data.length === 0
            ? `
                <tr>
                    <td colspan="6" style="
                        text-align:center;
                        padding:20px;
                        font-size:20px;
                        font-weight:600;
                        border-radius:10px;
                    ">No Issue History found.</td>
                </tr>
              `
            : `
                <tr id="first-row">

                <th>Enrollment No.</th>
                <th>Student's Name</th>
                <th>Staff's Name</th>
                <th>ISBN</th>
                <th>Book Title</th>
                <th>Issue_Date</th>
                <th>Return_date</th>
                <th>Return Status</th>

                </tr>
                ${
                    data.map(book => `
                    <tr>
                        <td>${book.enrollment_no}</td>
                        <td>${book.student_name}</td>
                        <td>${book.staff_name}</td>
                        <td>${book.isbn}</td>
                        <td>${book.book_title}</td>
                        <td>${book.issue_date ? book.issue_date.split("T")[0] : "-"}</td>
                        <td>${book.return_date ? book.return_date.split("T")[0] : "-"}</td>
                        <td>${book.return_status ? "Returned" : "Issued"}</td>
                    </tr>
                `).join("")
            }
                `;
});