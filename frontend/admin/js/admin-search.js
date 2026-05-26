const adminSearchInput = document.querySelector('.navbar-search input');

if (adminSearchInput) {
  adminSearchInput.addEventListener('keyup', function () {
    const value = this.value.toLowerCase().trim();

    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach((row) => {
      const text = row.innerText.toLowerCase();

      row.style.display = text.includes(value) ? '' : 'none';
    });
  });
}