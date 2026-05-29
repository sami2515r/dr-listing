function loadNavbarAuth() {

  const authButtons =
    document.getElementById('authButtons');

  if (!authButtons) {
    return;
  }

  const user =
    JSON.parse(localStorage.getItem('doctor_user'));

  const navLinks = document.querySelectorAll(
    'nav a:not(.nav-btn)'
  );

  if (user) {

    // Hide normal navbar links
    navLinks.forEach((link) => {
      link.style.display = 'none';
    });

    authButtons.innerHTML = `

      <div class="user-menu">

        <a href="dashboard.html">
          Dashboard
        </a>

        <a href="my-schedules.html">
          My Schedules
        </a>
<a href="my-hospitals.html">
  My Hospitals
</a>
        <span>
          Welcome, ${user.name}
        </span>

        <button onclick="logoutUser()">
          Logout
        </button>

      </div>
    `;

  } else {

    // Show normal navbar links
    navLinks.forEach((link) => {
      link.style.display = 'inline-block';
    });

    authButtons.innerHTML = `

      <div class="auth-links">

<a href="login.html"
   class="nav-auth-btn nav-login-btn">

          Login

        </a>

<a href="register.html"
   class="nav-auth-btn nav-register-btn">

          Register

        </a>

      </div>
    `;
  }
}

function logoutUser() {

  localStorage.removeItem('doctor_user');

  window.location.href = 'index.html';
}

loadNavbarAuth();

function setActiveNavbarLink() {
  const currentPage = window.location.pathname.split('/').pop();

  const navLinks = document.querySelectorAll('.navbar nav a');

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
      link.classList.add('active-nav-link');
    }
  });
}

setActiveNavbarLink();