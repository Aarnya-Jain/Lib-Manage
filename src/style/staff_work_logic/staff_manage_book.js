// Show modal

let add_btn  = document.getElementById('add');

add_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById('addBookModal').classList.add('active');
});

// Close Modal

let closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addBookForm").reset();
  document.getElementById('addBookModal').classList.remove('active');
});

let closeModal2 = document.getElementById('cancelBtn');

closeModal2.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById("addBookForm").reset();
  document.getElementById('addBookModal').classList.remove('active');
});

// Navigate back to staff Dashbooard

let back_btn = document.querySelector('#back');

back_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  window.location.href = "/staff.html";
});

document.addEventListener("click", async (e) => {

    if (e.target.closest(".delete-btn") && e.target.closest(".delete-btn").dataset.bookIsbn) {
        e.preventDefault();

        const btn = e.target.closest(".delete-btn");
        const isbn = btn.dataset.bookIsbn;

        document.getElementById('deleteConfirmMessage').textContent = `Are you sure you want to delete the book with ISBN "${isbn}"? This action cannot be undone.`;

        document.querySelector(".btn-delete-confirm").dataset.bookIsbn = isbn;

        document.getElementById("deleteConfirmModal").classList.add("active");
    }

    if (e.target.classList.contains("btn-delete-cancel")) {
        document.getElementById("deleteConfirmModal").classList.remove("active");
    }

});


// getting all book data
document.addEventListener("DOMContentLoaded", () => {

    // visible the table
    const table = document.getElementById("booktable");
    table.style.visibility="visible";

    // getting all books data
    fetch("/books")
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const container = document.getElementById("booktable");
            container.innerHTML = data.length === 0
            ? `
                <tr>
                    <td colspan="6" style="
                        text-align:center;
                        padding:20px;
                        font-size:20px;
                        font-weight:600;
                        border-radius:10px;
                    ">No books found.</td>
                </tr>
              `
            : `
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Shelf No.</th>
                    <th>Quantity Available</th>
                    <th>.</th>
                </tr>
                ${
                    data.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>${book.category}</td>
                        <td>${book.shelf_no}</td>
                        <td>${book.quantity}</td>
                        <td>
                            <button class="delete-btn" data-book-isbn="${book.isbn}" aria-label="Delete book">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `).join("")
            }
              `;
        });
});


// searching by column
let searchbtn = document.querySelector("#searchbtn");
let table = document.querySelector("table");

searchbtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const column = document.querySelector("#search_by").value;
    const value = document.querySelector("#search").value;
    console.log("Searching column:", column, "value:", value);


    table.style.visibility = "visible";

    const res = await fetch(`/books/search?column=${column}&value=${encodeURIComponent(value)}`);
    const data = await res.json();


    if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return; // stop here if data is not an array
    }

    const container = document.getElementById("booktable");
    container.innerHTML = data.length === 0
            ? `
                <tr>
                    <td colspan="6" style="
                        text-align:center;
                        padding:20px;
                        font-size:20px;
                        font-weight:600;
                        border-radius:10px;
                    ">No books found.</td>
                </tr>
              `
            : `
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Shelf No.</th>
                    <th>Quantity Available</th>
                    <th>.</th>
                </tr>
                ${data.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>${book.category}</td>
                        <td>${book.shelf_no}</td>
                        <td>${book.quantity}</td>
                        <td>
                            <button class="delete-btn" data-book-isbn="${book.isbn}" aria-label="Delete book">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `).join("")}
              `;
});

// logic to add the book to the table
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const form = document.getElementById("addBookForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const bookData = {
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        isbn: document.getElementById("isbn").value.trim(),
        category: document.getElementById("category").value.trim(),
        shelf_no: document.getElementById("shelf_no").value.trim(),
        quantity: document.getElementById("quantity").value.trim()
    };

    console.log("Sending:", bookData);

    try {
        const res = await fetch("/add/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookData)
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            showSuccessAlert(data.message);
            form.reset();
        } else {
            showErrorAlert(data.message || data.error || "Error");
        }

    } catch (err) {
        console.error("Request failed:", err);
        showErrorAlert("Request failed");
    }
});

// logic to delete book
document.querySelector(".btn-delete-confirm").addEventListener("click", async (event) => {
    const isbn = event.target.dataset.bookIsbn;

    const res = await fetch("/delete/book", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn })
    });

    const data = await res.json();
    showSuccessAlert(data.message);

    if (res.ok) location.reload();
});