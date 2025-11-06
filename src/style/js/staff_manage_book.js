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
  document.getElementById('addBookModal').classList.remove('active');
});

let closeModal2 = document.getElementById('cancelBtn');

closeModal2.addEventListener('click',async (event)=>{
  event.preventDefault();
  document.getElementById('addBookModal').classList.remove('active');
});

// Navigate back to staff Dashbooard

let back_btn = document.querySelector('#back');

back_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  window.location.href = "/staff.html";
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
                </tr>
                ${data.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>${book.category}</td>
                        <td>${book.shelf_no}</td>
                        <td>${book.quantity}</td>
                    </tr>
                `).join("")}
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
                </tr>
                ${data.map(book => `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>${book.category}</td>
                        <td>${book.shelf_no}</td>
                        <td>${book.quantity}</td>
                    </tr>
                `).join("")}
              `;
});
