let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="index.html";
})


let profilebtn = document.querySelector("#myprofile");

profilebtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="profile.html";
})


let searchbtn=document.querySelector("#searchbtn");
let table=document.querySelector("table");

searchbtn.addEventListener("click",(event)=>{
    event.preventDefault();
    table.style.visibility="visible";

    // temp demo
    fetch("/users")
    .then(res => res.json())
    .then(data => {
        console.log(data);

        const container = document.getElementById("booktable");
        container.innerHTML = container.innerHTML + data.map(
        user => `
        <tr>
            <td id="sno">${user.id}</td>
            <td>${user.name}</td>
            <td>${user.age}</td>
        </tr>
        `
        ).join("");
    });

})