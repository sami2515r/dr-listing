const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);

  try {
    const response = await fetch(`${API_BASE}/auth/login.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (data.status === true) {
      localStorage.setItem('doctor_user', JSON.stringify(data.data));
      showToast('Login successful', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);

      return;
    }

    showToast(data.message || 'Invalid credentials', 'error');

  } catch (error) {
    console.log(error);
    showToast('Server error. Please try again.', 'error');
  }
});