// Show modal

let add_btn  = document.getElementById('add');

add_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById('addStudentModal').classList.add('active');
});

// Close Modal

let closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addStudentForm").reset();

  document.getElementById('addStudentModal').classList.remove('active');
});

let closeModal2 = document.getElementById('cancelBtn');

closeModal2.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addStudentForm").reset();

  document.getElementById('addStudentModal').classList.remove('active');
});

// Navigate back to staff Dashbooard

let back_btn = document.querySelector('#back');

back_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  window.location.href = "/staff.html";
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
/*
async function deleteStudent(enrollment_no) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const res = await fetch("/delete/student", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_no })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) location.reload();
}
*/