const API = "/api";

// Elements
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuBtn = document.getElementById("menuBtn");

const booksTbody = document.getElementById("booksTbody");
const resultMeta = document.getElementById("resultMeta");
const activeViewPill = document.getElementById("activeViewPill");

const openAddModalBtn = document.getElementById("openAddModalBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");

const bookForm = document.getElementById("bookForm");
const toast = document.getElementById("toast");

const bookId = document.getElementById("bookId");
const titleEl = document.getElementById("title");
const authorEl = document.getElementById("author");
const categoryEl = document.getElementById("category");
const publishedYearEl = document.getElementById("publishedYear");
const availableCopiesEl = document.getElementById("availableCopies");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const yearFilter = document.getElementById("yearFilter");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const refreshBtn = document.getElementById("refreshBtn");

// State
let allBooks = [];
let currentMode = "add";
let currentEndpoint = `${API}/books`;
let currentViewLabel = "All Books";

function showToast(msg, isError=false){
  toast.textContent = msg;
  toast.style.color = isError ? "#ffb3c2" : "";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

/** Sidebar */
function openSidebar(){
  sidebar.classList.add("open");
  backdrop.classList.add("show");
}
function closeSidebar(){
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
}
menuBtn.addEventListener("click", () => {
  const isMobile = window.matchMedia("(max-width: 980px)").matches;
  if (isMobile) openSidebar();
});
backdrop.addEventListener("click", () => closeSidebar());

/** Modal */
function openModal(mode, book=null){
  currentMode = mode;
  modal.classList.add("show");

  if (mode === "add"){
    modalTitle.textContent = "Add Book";
    modalSub.textContent = "Create a new book record";
    bookId.value = "";
    bookForm.reset();
    availableCopiesEl.value = 1;
  } else {
    modalTitle.textContent = "Edit Book";
    modalSub.textContent = "Update existing book details";
    bookId.value = book._id;
    titleEl.value = book.title;
    authorEl.value = book.author;
    categoryEl.value = book.category;
    publishedYearEl.value = book.publishedYear;
    availableCopiesEl.value = book.availableCopies;
  }
}
function closeModal(){
  modal.classList.remove("show");
}
openAddModalBtn.addEventListener("click", () => openModal("add"));
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/** API helpers */
async function apiFetch(url, options={}){
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

/** View pill */
function setViewLabel(label){
  currentViewLabel = label;
  if (!activeViewPill) return;

  if (label === "All Books") {
    activeViewPill.style.display = "none";
  } else {
    activeViewPill.style.display = "inline-flex";
    activeViewPill.textContent = label;
  }
}

/** Render */
function renderBooks(books){
  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = books.filter(b => {
    if (!q) return true;
    return (
      (b.title || "").toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q)
    );
  });

  resultMeta.textContent = `Showing ${filtered.length} of ${books.length} books`;

  booksTbody.innerHTML = filtered.map(b => {
    const canDelete = b.availableCopies === 0;
    return `
      <tr>
        <td><div class="strong">${escapeHtml(b.title)}</div><div class="muted small">${escapeHtml(b._id)}</div></td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.category)}</td>
        <td>${escapeHtml(String(b.publishedYear))}</td>
        <td>${escapeHtml(String(b.availableCopies))}</td>
        <td class="right">
          <div class="actions">
            <button class="btn btn-ghost" data-action="addCopies" data-id="${b._id}">+ Copies</button>
            <button class="btn" data-action="edit" data-id="${b._id}">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${b._id}" ${canDelete ? "" : "disabled"} title="${canDelete ? "Delete book" : "Set copies to 0 to delete"}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/** Load */
async function loadBooks(endpoint=currentEndpoint){
  resultMeta.textContent = "Loading...";
  try{
    const data = await apiFetch(endpoint);
    allBooks = data;
    renderBooks(allBooks);
  } catch(err){
    resultMeta.textContent = "Failed to load";
    showToast(err.message, true);
  }
}

/** Filters */
applyFilterBtn.addEventListener("click", async () => {
  const cat = (categoryFilter.value || "").trim();
  const year = (yearFilter.value || "").trim();

  if (cat) {
    currentEndpoint = `${API}/books/category/${encodeURIComponent(cat)}`;
    setViewLabel(`Category: ${cat}`);
  } else if (year) {
    currentEndpoint = `${API}/books/after/${encodeURIComponent(year)}`;
    setViewLabel(`Published After: ${year}`);
  } else {
    currentEndpoint = `${API}/books`;
    setViewLabel("All Books");
  }

  await loadBooks(currentEndpoint);
  closeSidebar();
});

clearFilterBtn.addEventListener("click", async () => {
  categoryFilter.value = "";
  yearFilter.value = "";
  currentEndpoint = `${API}/books`;
  setViewLabel("All Books");
  await loadBooks(currentEndpoint);
  closeSidebar();
});

refreshBtn.addEventListener("click", async () => {
  await loadBooks(currentEndpoint);
  closeSidebar();
});

/** Search */
searchInput.addEventListener("input", () => renderBooks(allBooks));

/** Table actions */
booksTbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const book = allBooks.find(b => b._id === id);

  try{
    if (action === "edit"){
      openModal("edit", book);
      return;
    }

    if (action === "addCopies"){
      const add = prompt("How many copies to add?", "1");
      const addCopies = Number(add);
      if (!Number.isFinite(addCopies) || addCopies <= 0) {
        showToast("Enter a valid positive number.", true);
        return;
      }
      await apiFetch(`${API}/books/${id}/copies`, {
        method: "PATCH",
        body: JSON.stringify({ addCopies })
      });
      showToast("Copies updated.");
      await loadBooks(currentEndpoint);
      return;
    }

    if (action === "delete"){
      if (!confirm("Delete this book? (Only works if copies = 0)")) return;
      await apiFetch(`${API}/books/${id}`, { method: "DELETE" });
      showToast("Book deleted.");
      await loadBooks(currentEndpoint);
      return;
    }
  } catch(err){
    showToast(err.message, true);
  }
});

/** IMPORTANT FIX:
 * After Add/Edit, always return to ALL BOOKS view so user sees the new record
 */
async function resetToAllBooks(){
  categoryFilter.value = "";
  yearFilter.value = "";
  currentEndpoint = `${API}/books`;
  setViewLabel("All Books");
  await loadBooks(currentEndpoint);
}

/** Form submit */
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: titleEl.value.trim(),
    author: authorEl.value.trim(),
    category: categoryEl.value.trim(),
    publishedYear: Number(publishedYearEl.value),
    availableCopies: Number(availableCopiesEl.value)
  };

  try{
    if (currentMode === "add"){
      await apiFetch(`${API}/books`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showToast("Book added.");
    } else {
      const id = bookId.value;
      await apiFetch(`${API}/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showToast("Book updated.");
    }

    closeModal();
    await resetToAllBooks(); // key fix
  } catch(err){
    showToast(err.message, true);
  }
});

/** Init */
setViewLabel("All Books");
loadBooks();
