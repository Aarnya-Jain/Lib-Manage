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
  document.getElementById('addStaffModal').classList.remove('active');
});

let closeModal2 = document.getElementById('cancelBtn');

closeModal2.addEventListener('click',async (event)=>{
  event.preventDefault();
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


