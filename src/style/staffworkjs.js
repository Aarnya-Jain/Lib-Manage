// book issuing logic

let submit_button = document.querySelector('#submit_button');

submit_button.addEventListener('click', async (event) => {
  event.preventDefault();

  let student_enroll = document.querySelector('#enr').value.trim();
  let isbn = document.querySelector('#isbn').value.trim();
  let staff_id = localStorage.getItem("curr_user");

  console.log("Issuing for ", student_enroll, staff_id, isbn);

  const res = await fetch("/issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_enroll, staff_id, isbn })
  });

  const data = await res.json().catch(()=>null);

  console.log(data);

  if (data.message === "Book issued successfully") {
    document.querySelector('#enr').value = "";
    document.querySelector('#isbn').value = "";
    window.location.href = "/issue_successfull.html";
  } else {
    alert(data.error || data.message || "Unknown error");
  }
});
