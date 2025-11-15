// Show return modal
document.getElementById('return_btn').addEventListener('click', () => {
    document.getElementById('returnBookModal').classList.add('active');
});

// Close modal when clicking close button
document.getElementById('returnModalClose').addEventListener('click', () => {
    const form = document.querySelector("#returnBookForm");
    form.reset();
    document.getElementById('returnBookModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('returnBookModal').addEventListener('click', (e) => {
    if (e.target.id === 'returnBookModal') {
        const form = document.querySelector("#returnBookForm");
        form.reset();
        document.getElementById('returnBookModal').classList.remove('active');
    }
});

// book returning logic
let return_submit_button = document.querySelector('#submit_button_return');

return_submit_button.addEventListener('click', async (event) => {
    event.preventDefault();

    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let student_enroll = document.querySelector('#return_enr').value.trim();
    let isbn = document.querySelector('#return_isbn').value.trim();
    let staff_id = localStorage.getItem("curr_user");

    console.log("Returning for ", student_enroll, staff_id, isbn);

    const res = await fetch("/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_enroll, staff_id, isbn })
    });

    const data = await res.json().catch(() => null);

    console.log(data);

    if (res.ok) {
        showSuccessAlert(data.message);
        await delay();
        form.reset();
        location.reload();
    } else {
        showErrorAlert(data.error || data.message || "Unknown error");
    }
});
