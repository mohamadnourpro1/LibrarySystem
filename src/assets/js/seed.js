(function seed() {
  const books = localStorage.getItem("books");
  const members = localStorage.getItem("members");
  const loans = localStorage.getItem("loans");

  if (!books) {
    Storage.set("books", [
      { id: Storage.uid("book"), title: "Clean Code", author: "Robert C. Martin", year: 2008, available: true },
      { id: Storage.uid("book"), title: "You Don't Know JS", author: "Kyle Simpson", year: 2015, available: true }
    ]);
  }
  if (!members) {
    Storage.set("members", [
      { id: Storage.uid("mem"), name: "Ali Ahmad", phone: "0500000000" },
      { id: Storage.uid("mem"), name: "Sara Omar", phone: "0550000000" }
    ]);
  }
  if (!loans) Storage.set("loans", []);
})();
