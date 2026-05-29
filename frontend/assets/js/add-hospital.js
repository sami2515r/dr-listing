const doctorUser = JSON.parse(localStorage.getItem('doctor_user'));

if (!doctorUser) {
  window.location.href = 'login.html';
}

document.getElementById('hospitalPhone').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

document.getElementById('addHospitalForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.querySelector('#addHospitalForm button[type="submit"]');

submitBtn.disabled = true;
submitBtn.innerText = 'Sending...';

  const formData = new FormData();

  formData.append('doctor_id', doctorUser.id);
  formData.append('name', document.getElementById('hospitalName').value.trim());
  formData.append('hospital_type', document.getElementById('hospitalType').value.trim());
  formData.append('phone', document.getElementById('hospitalPhone').value.trim());
  formData.append('description', document.getElementById('description').value.trim());

  formData.append('addresses_line1', document.getElementById('address1').value.trim());
  formData.append('addresses_line2', document.getElementById('address2').value.trim());
  formData.append('city', document.getElementById('city').value.trim());
  formData.append('state', document.getElementById('state').value.trim());
  formData.append('country', document.getElementById('country').value.trim());
  formData.append('pincode', document.getElementById('pincode').value.trim());

  try {
    const response = await fetch(`${API_BASE}/doctor_hospitals/add_hospital.php`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

if (result.status === true) {
  showToast('Hospital request sent to admin', 'success');

  setTimeout(() => {
    window.location.href = 'my-hospitals.html';
  }, 1800);

  return;
} else {
  submitBtn.disabled = false;
  submitBtn.innerText = 'Send Hospital Request';

  showToast(result.message || 'Hospital request failed', 'error');
}

} catch (error) {
  console.log(error);

  submitBtn.disabled = false;
  submitBtn.innerText = 'Send Hospital Request';

  showToast('Server error', 'error');
}
});