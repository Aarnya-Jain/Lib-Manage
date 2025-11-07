document.addEventListener("click", (e) => {

    if (e.target.id === "issue") {
        window.location.href = "/staff_issue.html";
    }

    if (e.target.id === "man_st") {
        window.location.href = "/staff_manage_student.html";
    }

    if (e.target.id === "man_bk") {
        window.location.href = "/staff_manage_book.html";
    }

    if (e.target.id === "man_stf") {
        window.location.href = "/staff_manage_staff.html";
    }
});


let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="index.html";
})

let profilebtn = document.querySelector("#myprofile");

profilebtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="staff_profile.html";
})

document.addEventListener("DOMContentLoaded", () => {

    // getting pfp of current logged in staff
    let staff_id = localStorage.getItem("curr_user");

    fetch(`/info/staff?staff_id=${encodeURIComponent(staff_id)}`)
        .then(res => res.json())
        .then(data => {

            const container1 = document.querySelector(".profile");
            const img = document.createElement("img");
            img.className = "pfp";
            img.src = data[0].image || "default_profile.png";
            img.alt = "pfp";
            container1.appendChild(img);

            const workButtons = document.querySelector(".do_sumthing");
            workButtons.innerHTML = ""; // clear old content

            function makeBtn(id, text) {
                const btn = document.createElement("button");
                btn.id = id;
                btn.textContent = text;
                return btn;
            }

            if (data[0].role === "librarian") {
                workButtons.appendChild(makeBtn("man_bk", "Manage Books"));
                workButtons.appendChild(makeBtn("issue", "Issue Books"));
                workButtons.appendChild(makeBtn("return", "Return Books"));
            }

            else if (data[0].role === "admin") {
                workButtons.appendChild(makeBtn("man_st", "Manage Students"));
                workButtons.appendChild(makeBtn("man_bk", "Manage Books"));
                workButtons.appendChild(makeBtn("man_stf", "Manage Staff"));
            }

        });

});
