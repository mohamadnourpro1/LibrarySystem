(function () {
  const books = Storage.get("books", []);
  const members = Storage.get("members", []);
  const loans = Storage.get("loans", []);

  const available = books.filter(b => b.available).length;
  const activeLoans = loans.filter(l => !l.returnedAt).length;

  document.getElementById("booksCount").textContent = books.length;
  document.getElementById("availableCount").textContent = available;
  document.getElementById("membersCount").textContent = members.length;
  document.getElementById("activeLoansCount").textContent = activeLoans;
})();
