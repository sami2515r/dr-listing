async function loadDegreesForRegister() {
  const qualification = document.getElementById('qualification');

  try {
    const response = await fetch(`${API_BASE}/degree_masters/list.php`);
    const result = await response.json();

    const degrees = result.data || [];
    const activeDegrees = degrees.filter((degree) => Number(degree.status) === 1);

    qualification.innerHTML = `<option value="">Select Qualification</option>`;

    if (activeDegrees.length === 0) {
      qualification.innerHTML = `<option value="">No active degrees available</option>`;
      return;
    }

    activeDegrees.forEach((degree) => {
      qualification.innerHTML += `
        <option value="${degree.name}">
          ${degree.name}
        </option>
      `;
    });

  } catch (error) {
    console.log(error);
    qualification.innerHTML = `<option value="">Failed to load degrees</option>`;
  }
}

async function loadSpecializationsForRegister() {
  const specialization = document.getElementById('specialization');

  try {
    const response = await fetch(`${API_BASE}/specialization_masters/list.php`);
    const result = await response.json();

    const specializations = result.data || [];

    const activeSpecializations = specializations.filter((item) => {
      return Number(item.status) === 1;
    });

    specialization.innerHTML = `<option value="">Select Specialization</option>`;

    if (activeSpecializations.length === 0) {
      specialization.innerHTML = `<option value="">No active specializations available</option>`;
      return;
    }

    activeSpecializations.forEach((item) => {
      specialization.innerHTML += `
        <option value="${item.name}">
          ${item.name}
        </option>
      `;
    });

  } catch (error) {
    console.log(error);
    specialization.innerHTML = `<option value="">Failed to load specializations</option>`;
  }
}

function setupPhoneValidation() {
  const phoneInput = document.getElementById('phone');

  if (!phoneInput) return;

  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });
}

loadDegreesForRegister();
loadSpecializationsForRegister();
setupPhoneValidation();

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value.trim();
  const qualification = document.getElementById('qualification').value;
  const specialization = document.getElementById('specialization').value;
  const consultingFee = document.getElementById('consulting_fee').value;
  const availabilityStatus = document.getElementById('availability_status').value;
  const description = document.getElementById('description').value.trim();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
  const phonePattern = /^[0-9]{10}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (name === '') {
    showToast('Name is required', 'error');
    return;
  }

  if (!emailPattern.test(email)) {
    showToast('Enter a valid email address', 'error');
    return;
  }

  if (!phonePattern.test(phone)) {
    showToast('Phone number must be exactly 10 digits', 'error');
    return;
  }

  if (!passwordPattern.test(password)) {
    showToast('Password must be minimum 8 characters with letter, number and special symbol', 'error');
    return;
  }

  if (qualification === '') {
    showToast('Please select qualification', 'error');
    return;
  }

  if (specialization === '') {
    showToast('Please select specialization', 'error');
    return;
  }

  const formData = new FormData();

  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('phone', phone);
  formData.append('qualification', qualification);
  formData.append('specialization', specialization);
  formData.append('consulting_fee', consultingFee);
  formData.append('availability_status', availabilityStatus);
  formData.append('description', description);

  const imageFile = document.getElementById('profile_image').files[0];

  if (imageFile) {
    formData.append('profile_image', imageFile);
  }

  try {
    const response = await fetch(`${API_BASE}/auth/register.php`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.status === true) {
      showToast('Registration successful. Please wait for admin approval.', 'success');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3200);

    } else {
      showToast(data.message || 'Registration failed', 'error');
    }

  } catch (error) {
    console.log(error);
    showToast('Server error. Please try again.', 'error');
  }
});