document.addEventListener("click", (e) => {

    if (e.target.id === "add") {
        e.preventDefault();
        document.getElementById("addStudentModal").classList.add("active");
    }

    if (e.target.id === "closeModal") {
        e.preventDefault();
        document.getElementById("addStudentForm").reset();
        document.getElementById("addStudentModal").classList.remove("active");
    }

    if (e.target.id === "cancelBtn") {
        e.preventDefault();
        document.getElementById("addStudentForm").reset();
        document.getElementById("addStudentModal").classList.remove("active");
    }

    if (e.target.id === "back") {
        e.preventDefault();
        window.location.href = "/staff.html";
    }

    if (e.target.closest(".delete-btn")) {
        e.preventDefault();
        const btn = e.target.closest(".delete-btn");
        const studentId = btn.dataset.studentId;

        document.getElementById('deleteConfirmMessage').textContent =
        `Are you sure you want to delete student with Enrollment No. ${studentId}? This action cannot be undone.`;

        document.getElementById("deleteConfirmModal").classList.add("active");

        document.querySelector(".btn-delete-confirm").dataset.studentId = studentId;
    }

    if (e.target.classList.contains("btn-delete-cancel")) {
        e.preventDefault();
        document.getElementById("deleteConfirmModal").classList.remove("active");
    }
});


// logic to get all student data
document.addEventListener("DOMContentLoaded", () => {

    // visible the table
    const table = document.getElementById("studtable");
    table.style.visibility="visible";

    // getting all student data
    fetch("/info/students")
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("studtable");
            container.innerHTML = data.length === 0
                ? `
                    <tr>
                        <td colspan="7" style="
                            text-align:center;
                            padding:20px;
                            font-size:20px;
                            font-weight:600;
                            border-radius:13px;
                        ">No student records found.</td>
                    </tr>
                  `
                : `
                    <tr>
                        <th>Enrollment No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Branch</th>
                        <th>Graduating Year</th>
                        <th>.</th>
                    </tr>
                    ${data.map(student => `
                        <tr>
                            <td>${student.enrollment_no}</td>
                            <td><img src="${student.image}" alt="pfp" class="pfp"></td>
                            <td>${student.name}</td>
                            <td>${student.phno}</td>
                            <td>${student.email}</td>
                            <td>${student.branch}</td>
                            <td>${student.grad_year}</td>
                            <td>
                                <button class="delete-btn" data-student-id="${student.enrollment_no}" aria-label="Delete student">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                  `;
        });
});


// logic to search student by column
// searching by column
let searchbtn = document.querySelector("#searchbtn");
let table = document.querySelector("table");

searchbtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const column = document.querySelector("#search_by").value;
    const value = document.querySelector("#search").value;
    console.log("Searching column:", column, "value:", value);


    table.style.visibility = "visible";

    const res = await fetch(`/student/search?column=${column}&value=${encodeURIComponent(value)}`);
    const data = await res.json();


    if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return; // stop here if data is not an array
    }

    const container = document.getElementById("studtable");

    container.innerHTML = data.length === 0
                ? `
                    <tr>
                        <td colspan="7" style="
                            text-align:center;
                            padding:20px;
                            font-size:20px;
                            font-weight:600;
                            border-radius:13px;
                        ">No student records found.</td>
                    </tr>
                  `
                : `
                    <tr>
                        <th>Enrollment No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Branch</th>
                        <th>Graduating Year</th>
                        <th>.</th>
                    </tr>
                    ${data.map(student => `
                        <tr>
                            <td>${student.enrollment_no}</td>
                            <td><img src="${student.image}" alt="pfp" class="pfp"></td>
                            <td>${student.name}</td>
                            <td>${student.phno}</td>
                            <td>${student.email}</td>
                            <td>${student.branch}</td>
                            <td>${student.grad_year}</td>
                            <td>
                                <button class="delete-btn" data-student-id="${student.enrollment_no}" aria-label="Delete student">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                  `;
});


// logic to add a new Student
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const staff_id = localStorage.getItem("curr_user");

    const form = document.getElementById("addStudentForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    formData.append("staff_id", staff_id);

    for (let entry of formData.entries()) {
        console.log(entry[0], entry[1]);
    }

    try {
        const res = await fetch("/add/student", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            alert(data.message);
            form.reset();
        } else {
            alert(data.message || data.error || "Error");
        }

    } catch (err) {
        console.error("Request failed:", err);
        alert("Request failed");
    }
});

// logic to delete student
document.querySelector(".btn-delete-confirm").addEventListener("click", async (event) => {
    const studentId = event.target.dataset.studentId;

    const res = await fetch("/delete/student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_no: studentId })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) location.reload();
});
