const currentUser = JSON.parse(localStorage.getItem('doctor_user'));

if (!currentUser) {
  window.location.href = 'login.html';
}

let currentDoctor = null;
let degreeOptions = [];
let specializationOptions = [];
let availabilityOptions = [];

async function loadDegreeOptions() {
  const response = await fetch(`${API_BASE}/degree_masters/list.php`);
  const result = await response.json();

  degreeOptions = (result.data || []).filter((item) => {
    return Number(item.status) === 1;
  });
}

async function loadSpecializationOptions() {
  const response = await fetch(`${API_BASE}/specialization_masters/list.php`);
  const result = await response.json();

  specializationOptions = (result.data || []).filter((item) => {
    return Number(item.status) === 1;
  });
}
async function loadAvailabilityOptions() {
  const response = await fetch(`${API_BASE}/doctors/list.php`);
  const result = await response.json();

  const doctors = result.data || result || [];

  availabilityOptions = [
    ...new Set(
      doctors
        .map((doctor) => doctor.availability_status)
        .filter(Boolean)
    )
  ];
}

async function loadDoctorProfile() {
  const container = document.getElementById('doctorDashboardProfile');

  try {
    const response = await fetch(
      `${API_BASE}/doctors/single.php?id=${currentUser.id}&t=${Date.now()}`
    );

    const result = await response.json();
    currentDoctor = result.data || result;

    container.innerHTML = `
      <div class="doctor-profile-card">

        <div class="doctor-profile-image">
          <img
            src="${
              currentDoctor.profile_image_url
                ? currentDoctor.profile_image_url
                : 'http://localhost/dr_listing/uploads/doctors/default.png'
            }"
          >
        </div>

        <div class="doctor-profile-content">

          <h1>${currentDoctor.name}</h1>

          <span class="doctor-degree">
            ${currentDoctor.qualification || ''}
          </span>

          <p>${currentDoctor.description || 'No description added'}</p>

          <div class="doctor-info-grid">

            <div class="info-box">
              <h3>Email</h3>
              <p>${currentDoctor.email || '-'}</p>
            </div>

            <div class="info-box">
              <h3>Phone</h3>
              <p>${currentDoctor.phone || '-'}</p>
            </div>

            <div class="info-box">
              <h3>Consulting Fee</h3>
              <p>₹${currentDoctor.consulting_fee || 0}</p>
            </div>

            <div class="info-box">
              <h3>Availability</h3>
              <p>${currentDoctor.availability_status || '-'}</p>
            </div>
<div class="info-box">
  <h3>Qualification</h3>

  <p>
    ${currentDoctor.qualification || '-'}
  </p>
</div>
            <div class="info-box">
              <h3>Specialization</h3>
              <p>${currentDoctor.specialization_name || 'General Physician'}</p>
            </div>

          </div>

          <button class="book-btn" onclick="showEditProfileForm()">
            Edit Profile
          </button>

        </div>

      </div>

      <div id="editProfileModal"></div>
    `;

  } catch (error) {
    console.log(error);
    container.innerHTML = `<div class="empty-state">Failed to load profile.</div>`;
  }
}

function showEditProfileForm() {

  const modal =
    document.getElementById('editProfileModal');

  modal.innerHTML = `

    <div class="profile-modal-overlay">

      <div class="profile-modal">

        <div class="profile-modal-header">

          <h2>Edit Profile</h2>

          <button
            class="close-modal-btn"
            onclick="closeEditModal()"
          >
            ✕
          </button>

        </div>

        <form
          class="edit-profile-form"
          id="editProfileForm"
        >

          <div class="edit-profile-grid">

            <div class="edit-profile-field">
              <label>Name</label>

              <input
                type="text"
                id="editName"
                value="${currentDoctor.name || ''}"
              >
            </div>
<div class="edit-profile-field">
  <label>Email</label>

  <input
    type="email"
    id="editEmail"
    value="${currentDoctor.email || ''}"
  >
</div>
            <div class="edit-profile-field">
              <label>Phone</label>

              <input
                type="text"
                id="editPhone"
                value="${currentDoctor.phone || ''}"
              >
            </div>

            <div class="edit-profile-field">
              <label>Qualification</label>

             <select id="editQualification" class="chosen-select">
  ${degreeOptions.map((degree) => `
    <option
      value="${degree.name}"
      ${currentDoctor.qualification === degree.name ? 'selected' : ''}
    >
      ${degree.name}
    </option>
  `).join('')}
</select>
              
            </div>
<div class="edit-profile-field">
  <label>Specialization</label>

  <select id="editSpecialization" class="chosen-select">
    ${specializationOptions.map((specialization) => `
      <option
        value="${specialization.name}"
        ${currentDoctor.specialization_name === specialization.name ? 'selected' : ''}
      >
        ${specialization.name}
      </option>
    `).join('')}
  </select>
</div>
            <div class="edit-profile-field">
              <label>Consulting Fee</label>

              <input
                type="number"
                id="editFee"
                value="${currentDoctor.consulting_fee || 0}"
              >
            </div>

            <div class="edit-profile-field">

              <label>Availability</label>

<select id="editAvailability" class="chosen-select">
  ${availabilityOptions.map((status) => `
    <option
      value="${status}"
      ${currentDoctor.availability_status === status ? 'selected' : ''}
    >
      ${status}
    </option>
  `).join('')}
</select>

            </div>

<div
  class="edit-profile-field"
  style="grid-column:1/-1;"
>
<div class="edit-profile-field">
  <label>Profile Image</label>

  <input
    type="file"
    id="editProfileImage"
    accept="image/*"
  >
</div>
<br>
<div
  class="edit-profile-field"
  style="grid-column:1/-1;"
>
  <label>Description</label>

  <textarea id="editDescription">${currentDoctor.description || ''}</textarea>
</div>
</div>

          <div class="edit-profile-actions">

            <button
              type="submit"
              class="save-profile-btn"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById('editProfileForm')
    .addEventListener('submit', updateProfile);
$('.chosen-select').chosen('destroy');

$('.chosen-select').chosen({
  width: '100%',
  no_results_text: 'No results found'
});

$('.chosen-select').trigger('chosen:updated');
}


function closeEditModal() {

  document.getElementById(
    'editProfileModal'
  ).innerHTML = '';
}

async function updateProfile(event) {
  event.preventDefault();

  const formData = new FormData();

  formData.append('id', currentUser.id);
  formData.append('name', document.getElementById('editName').value);
  formData.append('email', document.getElementById('editEmail').value);
  formData.append('phone', document.getElementById('editPhone').value);
  formData.append('qualification', document.getElementById('editQualification').value);
  formData.append('specialization', document.getElementById('editSpecialization').value);
  formData.append('consulting_fee', document.getElementById('editFee').value);
  formData.append('availability_status', document.getElementById('editAvailability').value);
  formData.append('description', document.getElementById('editDescription').value);
  const imageFile = document.getElementById('editProfileImage').files[0];

if (imageFile) {
  formData.append('profile_image', imageFile);
}

  try {
    const response = await fetch(`${API_BASE}/doctors/update.php`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

if (result.status === true) {

  currentUser.name = document.getElementById('editName').value;
  localStorage.setItem('doctor_user', JSON.stringify(currentUser));

  closeEditModal();

  await loadDoctorProfile();
}

  } catch (error) {
    console.log(error);
    showToast('Profile update failed', 'error');
  }
}

Promise.all([
  loadDegreeOptions(),
  loadSpecializationOptions(),
  loadAvailabilityOptions()
]).then(() => {
  loadDoctorProfile();
});

async function loadDashboardHospitals() {

  const user =
    JSON.parse(localStorage.getItem('doctor_user'));

  const container =
    document.getElementById('dashboardHospitals');

  if (!user || !container) {
    return;
  }

  try {

    const response = await fetch(
      `${API_BASE}/doctor_hospitals/my.php?doctor_id=${user.id}`
    );

    const result = await response.json();

    const hospitals = result.data || [];

    const approvedHospitals =
      hospitals.filter((item) => Number(item.request_status) === 1);

    if (approvedHospitals.length === 0) {

      container.innerHTML = `
        <div class="empty-state">
          No assigned hospitals yet.
        </div>
      `;

      return;
    }

    container.innerHTML = '';

    approvedHospitals.forEach((hospital) => {

      container.innerHTML += `

        <div class="doctor-card">

          <div class="doctor-content">

            <h3>
              ${hospital.name}
            </h3>

            <p>
              ${hospital.hospital_type || ''}
            </p>

            <p>
              ${hospital.addresses_line1 || ''}
              ${hospital.addresses_line2 || ''}
            </p>

            <p>
              ${hospital.city || ''},
              ${hospital.state || ''},
              ${hospital.country || ''} -
              ${hospital.pincode || ''}
            </p>

            <p>
              ${hospital.phone || ''}
            </p>

          </div>

        </div>
      `;
    });

  } catch (error) {

    console.log(error);

    container.innerHTML = `
      <div class="empty-state">
        Failed to load hospitals.
      </div>
    `;
  }
}

loadDashboardHospitals();