const user = localStorage.getItem('admin_user');

if (!user) {
  window.location.href = 'login.html';
} else {
  const parsed = JSON.parse(user);

  if (parsed.role !== 'admin') {
    showToast('Unauthorized access', 'error');

    localStorage.removeItem('admin_user');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}