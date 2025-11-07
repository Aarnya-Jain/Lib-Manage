// Show modal

let add_btn  = document.getElementById('add');

add_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById('addStaffModal').classList.add('active');
});

// Close Modal

let closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addStaffForm").reset();

  document.getElementById('addStaffModal').classList.remove('active');
});

let closeModal2 = document.getElementById('cancelBtn');

closeModal2.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addStaffForm").reset();

  document.getElementById('addStaffModal').classList.remove('active');
});

// Navigate back to staff Dashbooard

let back_btn = document.querySelector('#back');

back_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  window.location.href = "/staff.html";
});

// logic to get all staff data
document.addEventListener("DOMContentLoaded", () => {

    // visible the table
    const table = document.getElementById("stafftable");
    table.style.visibility="visible";

    // getting all staff data
    fetch("/info/staffs")
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("stafftable");
            container.innerHTML = data.length === 0
                ? `
                    <tr>
                        <td colspan="7" style="
                            text-align:center;
                            padding:20px;
                            font-size:20px;
                            font-weight:600;
                            border-radius:13px;
                        ">No staff records found.</td>
                    </tr>
                  `
                : `
                    <tr>
                        <th>Staff ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    ${data.map(staff => `
                        <tr>
                            <td>${staff.staff_id}</td>
                            <td><img src="${staff.image}" alt="pfp" class="pfp"></td>
                            <td>${staff.name}</td>
                            <td>${staff.phno}</td>
                            <td>${staff.email}</td>
                            <td>${staff.role}</td>
                        </tr>
                    `).join("")}
                  `;
        });
});


// logic to search staff by column
// searching by column
let searchbtn = document.querySelector("#searchbtn");
let table = document.querySelector("table");

searchbtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const column = document.querySelector("#search_by").value;
    const value = document.querySelector("#search").value;
    console.log("Searching column:", column, "value:", value);


    table.style.visibility = "visible";

    const res = await fetch(`/staff/search?column=${column}&value=${encodeURIComponent(value)}`);
    const data = await res.json();


    if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return; // stop here if data is not an array
    }

    const container = document.getElementById("stafftable");

    container.innerHTML = data.length === 0
                ? `
                    <tr>
                        <td colspan="7" style="
                            text-align:center;
                            padding:20px;
                            font-size:20px;
                            font-weight:600;
                            border-radius:13px;
                        ">No staff records found.</td>
                    </tr>
                  `
                : `
                    <tr>
                        <th>Staff ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    ${data.map(staff => `
                        <tr>
                            <td>${staff.staff_id}</td>
                            <td><img src="${staff.image}" alt="pfp" class="pfp"></td>
                            <td>${staff.name}</td>
                            <td>${staff.phno}</td>
                            <td>${staff.email}</td>
                            <td>${staff.role}</td>
                        </tr>
                    `).join("")}
                  `;
});


// logic to add a new staff
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const form = document.getElementById("addStaffForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    for (let entry of formData.entries()) {
        console.log(entry[0], entry[1]);
    }

    try {
        const res = await fetch("/add/staff", {
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

// logic to delete staff
/*
async function deleteStaff(staff_id) {
    if (!confirm("Delete this staff?")) return;

    const res = await fetch("/delete/staff", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_id })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) location.reload();
}

*/