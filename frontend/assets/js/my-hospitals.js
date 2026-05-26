const user = JSON.parse(localStorage.getItem('doctor_user'));

if (!user) {
  window.location.href = 'login.html';
}

let myHospitalRequests = [];

async function loadActiveHospitals() {
  const hospitalSelect = document.getElementById('hospitalSelect');

  try {
    const response = await fetch(`${API_BASE}/hospitals/active.php`);
    const result = await response.json();

    const hospitals = result.data || [];

    hospitalSelect.innerHTML = `<option value="">Select Hospital</option>`;

    const requestedHospitalIds = myHospitalRequests.map((item) =>
      Number(item.hospital_id)
    );

    const availableHospitals = hospitals.filter((hospital) => {
      return !requestedHospitalIds.includes(Number(hospital.id));
    });

    if (availableHospitals.length === 0) {
      hospitalSelect.innerHTML = `<option value="">No hospitals available</option>`;
      return;
    }

    availableHospitals.forEach((hospital) => {
      hospitalSelect.innerHTML += `
        <option value="${hospital.id}">
          ${hospital.name} - ${hospital.city || ''}
        </option>
      `;
    });

  } catch (error) {
    console.log(error);
    showToast('Failed to load hospitals', 'error');
  }
}

async function loadMyHospitals() {
  try {
    const response = await fetch(
      `${API_BASE}/doctor_hospitals/my.php?doctor_id=${user.id}`
    );

    const result = await response.json();
    myHospitalRequests = result.data || [];

    const approvedHospitals = document.getElementById('approvedHospitals');
    const pendingHospitals = document.getElementById('pendingHospitals');
const rejectedHospitals = document.getElementById('rejectedHospitals');

    approvedHospitals.innerHTML = '';
    pendingHospitals.innerHTML = '';
rejectedHospitals.innerHTML = '';

const approved = myHospitalRequests.filter((item) => Number(item.request_status) === 1);

const pending = myHospitalRequests.filter((item) => Number(item.request_status) === 0);

const rejected = myHospitalRequests.filter((item) => Number(item.request_status) === 2);

    if (approved.length === 0) {
      approvedHospitals.innerHTML = `<div class="empty-state">No approved hospitals yet.</div>`;
    }

    if (pending.length === 0) {
      pendingHospitals.innerHTML = `<div class="empty-state">No pending requests.</div>`;
    }

    if (rejected.length === 0) {
  rejectedHospitals.innerHTML = `<div class="empty-state">No rejected requests.</div>`;
}

    approved.forEach((hospital) => {
      approvedHospitals.innerHTML += hospitalCard(hospital, 'Approved');
    });

    pending.forEach((hospital) => {
      pendingHospitals.innerHTML += hospitalCard(hospital, 'Pending', true);
    });

    rejected.forEach((hospital) => {
  rejectedHospitals.innerHTML += hospitalCard(hospital, 'Rejected');
});

    loadActiveHospitals();

  } catch (error) {
    console.log(error);
    showToast('Failed to load my hospitals', 'error');
  }
}

function hospitalCard(hospital, statusText, canCancel = false) {
  return `
    <div class="doctor-card">
      <div class="doctor-content">
        <h3>${hospital.name}</h3>
        <p>${hospital.hospital_type || ''}</p>
        <p>${hospital.addresses_line1 || ''} ${hospital.addresses_line2 || ''}</p>
        <p>${hospital.city || ''}, ${hospital.state || ''}, ${hospital.country || ''} - ${hospital.pincode || ''}</p>

        <span class="hospital-status ${statusText.toLowerCase()}">
          ${statusText}
        </span>

        ${
          canCancel
            ? `<button
  class="cancel-request-btn"
  onclick="cancelHospitalRequest(${hospital.id})"
>
  Cancel Request
</button>`
            : ''
        }
      </div>
    </div>
  `;
}

async function sendHospitalRequest() {
  const hospitalId = document.getElementById('hospitalSelect').value;

  if (!hospitalId) {
    showToast('Please select hospital', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('doctor_id', user.id);
  formData.append('hospital_id', hospitalId);

  try {
    const response = await fetch(`${API_BASE}/doctor_hospitals/request.php`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.status === true) {
      showToast('Hospital request sent to admin', 'success');
      loadMyHospitals();
    } else {
      showToast(result.message || 'Request failed', 'error');
    }

  } catch (error) {
    console.log(error);
    showToast('Server error', 'error');
  }
}

async function cancelHospitalRequest(requestId) {
  const formData = new FormData();

  formData.append('request_id', requestId);
  formData.append('doctor_id', user.id);

  try {
    const response = await fetch(`${API_BASE}/doctor_hospitals/cancel.php`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.status === true) {
      showToast('Request cancelled', 'success');
      loadMyHospitals();
    } else {
      showToast(result.message || 'Cancel failed', 'error');
    }

  } catch (error) {
    console.log(error);
    showToast('Server error', 'error');
  }
}

loadMyHospitals();