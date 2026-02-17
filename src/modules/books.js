(function () {
  const tbody = document.getElementById("booksTbody");
  const searchInput = document.getElementById("searchInput");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const titleInput = document.getElementById("titleInput");
  const authorInput = document.getElementById("authorInput");
  const yearInput = document.getElementById("yearInput");
  const errorText = document.getElementById("errorText");
  const addBtn = document.getElementById("addBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  let editingId = null;

  function getBooks() {
    return Storage.get("books", []);
  }

  function setBooks(books) {
    Storage.set("books", books);
  }

  function openModal(mode, book) {
    errorText.style.display = "none";
    modal.classList.add("active");

    if (mode === "add") {
      modalTitle.textContent = "إضافة كتاب";
      editingId = null;
      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
    } else {
      modalTitle.textContent = "تعديل كتاب";
      editingId = book.id;
      titleInput.value = book.title;
      authorInput.value = book.author;
      yearInput.value = book.year ?? "";
    }
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  function validate() {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
      errorText.textContent = "العنوان والمؤلف حقول مطلوبة.";
      errorText.style.display = "block";
      return null;
    }

    return {
      title,
      author,
      year: yearInput.value ? Number(yearInput.value) : null
    };
  }

  function render() {
    const q = searchInput.value.trim().toLowerCase();

    const books = getBooks().filter(b =>
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );

    tbody.innerHTML = books.map(b => `
      <tr>
        <td>${escapeHtml(b.title)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${b.year ?? "-"}</td>
        <td class="${b.available ? "status-ok" : "status-no"}">
          ${b.available ? "متاح" : "معار"}
        </td>
        <td>
          <button class="btn secondary" data-action="edit" data-id="${b.id}">تعديل</button>
          <button class="btn danger" data-action="delete" data-id="${b.id}">حذف</button>
        </td>
      </tr>
    `).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  addBtn.addEventListener("click", () => openModal("add"));
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  saveBtn.addEventListener("click", () => {
    const data = validate();
    if (!data) return;

    const books = getBooks();

    if (!editingId) {
      books.unshift({
        id: Storage.uid("book"),
        ...data,
        available: true
      });
    } else {
      const idx = books.findIndex(b => b.id === editingId);
      if (idx !== -1) {
        books[idx] = { ...books[idx], ...data };
      }
    }

    setBooks(books);
    closeModal();
    render();
  });

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    const books = getBooks();
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (action === "edit") {
      openModal("edit", book);
    }

    if (action === "delete") {
      if (!confirm("هل أنت متأكد من حذف الكتاب؟")) return;

      setBooks(books.filter(b => b.id !== id));
      render();
    }
  });

  searchInput.addEventListener("input", render);

  render();
})();
