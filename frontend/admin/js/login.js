const form = document.getElementById('adminLoginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showToast('Please enter email and password', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_BASE}/auth/login.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (data.status === true) {
      if (data.data.role !== 'admin') {
        showToast('This is not an admin account', 'error');
        return;
      }

      localStorage.setItem('admin_user', JSON.stringify(data.data));

      showToast('Admin login successful', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);

    } else {
      showToast(data.message || 'Invalid credentials', 'error');
    }

  } catch (error) {
    console.log(error);
    showToast('Server error. Please try again.', 'error');
  }
});