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

            const container = document.querySelector("#issue-table");
            container.innerHTML = `
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

<tr><td id="center">1</td><td>The Silent Patient</td><td>Alex Michaelides</td><td>9781250301697</td><td>Thriller</td><td id="center">2025-08-02</td><td id="center">2025-08-16</td><td class="right">0</td></tr>
<tr><td id="center">2</td><td>Project Hail Mary</td><td>Andy Weir</td><td>9780525559474</td><td>Science Fiction</td><td id="center">2025-09-05</td><td id="center">2025-09-19</td><td class="right">25</td></tr>
<tr><td id="center">3</td><td>Sapiens: A Brief History of Humankind</td><td>Yuval Noah Harari</td><td>9780062316097</td><td>History</td><td id="center">2025-07-10</td><td id="center">2025-07-24</td><td class="right">0</td></tr>
<tr><td id="center">4</td><td>Thinking, Fast and Slow</td><td>Daniel Kahneman</td><td>9780374533557</td><td>Psychology</td><td id="center">2025-06-18</td><td id="center">2025-07-02</td><td class="right">40</td></tr>
<tr><td id="center">5</td><td>Educated</td><td>Tara Westover</td><td>9780399590504</td><td>Memoir</td><td id="center">2025-09-01</td><td id="center">2025-09-15</td><td class="right">0</td></tr>
<tr><td id="center">6</td><td>Clean Code</td><td>Robert C. Martin</td><td>9780132350884</td><td>Programming</td><td id="center">2025-08-20</td><td id="center">2025-09-03</td><td class="right">15</td></tr>
<tr><td id="center">7</td><td>Where the Crawdads Sing</td><td>Delia Owens</td><td>9780735219106</td><td>Fiction</td><td id="center">2025-07-28</td><td id="center">2025-08-11</td><td class="right">0</td></tr>
<tr><td id="center">8</td><td>Atomic Habits</td><td>James Clear</td><td>9780735211292</td><td>Self-help</td><td id="center">2025-09-10</td><td id="center">2025-09-24</td><td class="right">0</td></tr>
<tr><td id="center">9</td><td>Introduction to Algorithms</td><td>CLRS</td><td>9780262046305</td><td>Textbook</td><td id="center">2025-06-01</td><td id="center">2025-06-15</td><td class="right">200</td></tr>
<tr><td id="center">10</td><td>The Alchemist</td><td>Paulo Coelho</td><td>9780061122415</td><td>Fable</td><td id="center">2025-08-29</td><td id="center">2025-09-12</td><td class="right">5</td></tr>
            `;
        });

});
