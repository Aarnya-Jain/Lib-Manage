// getting logged in student data

document.addEventListener("DOMContentLoaded", () => {

    let student_enroll = localStorage.getItem("curr_user");

    fetch(`/info/student?student_enroll=${encodeURIComponent(student_enroll)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const container = document.querySelector(".stud-info");
            container.innerHTML = `
                <div class="stud-img">
                    <img src="${data[0].image || 'default_profile.png'}">
                </div>

                <div class="info">
                    <p>Name: ${data[0].name}</p>
                    <p>Enrollment Number: ${data[0].enrollment_no}</p>
                    <p>Phone Number: ${data[0].phno}</p>
                    <p>Email: ${data[0].email}</p>
                    <p>Branch: ${data[0].branch}</p>
                    <p>Graduating Year: ${data[0].grad_year}</p>
                </div>
            `;
        });

        fetch(`/info/student/issue_history?student_enroll=${encodeURIComponent(student_enroll)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            // flattening the data
            data = data.filter(row => Array.isArray(row) && row.length > 0).map(row => row[0]);

            const container = document.querySelector("#issue-table");
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

                <th>Sno</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Issue_Date</th>
                <th>Return_date</th>
                <th>Fine</th>

                </tr>
                ` + data.map(
                    book =>
                    `
                    <tr><td id="center">${book.sno}</td><td>${book.t}</td><td>${book.a}</td><td>${book.i}</td><td>${book.c}</td><td id="center">${book.id.split("T")[0]}</td><td id="center">${book.rd ? book.rd.split("T")[0] : "-"}</td><td class="right">${book.fine || 0}</td></tr>
                    `
                ).join("")

        });

});
