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
})