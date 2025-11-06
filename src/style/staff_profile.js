// getting logged in staff data

document.addEventListener("DOMContentLoaded", () => {

    let staff_id = localStorage.getItem("curr_user");

    fetch(`/info/staff?staff_id=${encodeURIComponent(staff_id)}`)
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
                    <p>Staff_ID: ${data[0].staff_id}</p>
                    <p>Phone Number: ${data[0].phno}</p>
                    <p>Email: ${data[0].email}</p>
                    <p>Role: ${data[0].role}</p>
                </div>
            `;
        });
});
