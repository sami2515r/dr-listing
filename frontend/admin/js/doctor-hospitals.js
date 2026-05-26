const doctorSelect = document.getElementById('doctorSelect');
const hospitalSelect = document.getElementById('hospitalSelect');
const assignedHospitals = document.getElementById('assignedHospitals');
const assignedHospitalCount = document.getElementById('assignedHospitalCount');
const allDoctorHospitalLinks = document.getElementById('allDoctorHospitalLinks');
const pendingHospitalRequests = document.getElementById('pendingHospitalRequests');
const pendingRequestCount = document.getElementById('pendingRequestCount');

async function loadDoctors() {
  try {
    const response = await fetch(`${API_BASE}/doctors/list.php`);
    const result = await response.json();

    const doctors = result.data || [];

    doctors.forEach((doctor) => {
      doctorSelect.innerHTML += `
        <option value="${doctor.id}">
          ${doctor.name} - ${doctor.qualification || ''}
        </option>
      `;
    });

  } catch (error) {
    console.log(error);
    showToast('Failed to load doctors', 'error');
  }
}

async function loadHospitals() {
  try {
    const response = await fetch(`${API_BASE}/hospitals/list.php`);
    const result = await response.json();

    const hospitals = result.data || [];

    hospitals.forEach((hospital) => {
      hospitalSelect.innerHTML += `
        <option value="${hospital.id}">
          ${hospital.name}
        </option>
      `;
    });

  } catch (error) {
    console.log(error);
    showToast('Failed to load hospitals', 'error');
  }
}

async function assignHospital() {
  const doctorId = doctorSelect.value;
  const hospitalId = hospitalSelect.value;

  if (!doctorId || !hospitalId) {
    showToast('Select doctor and hospital', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('doctor_id', doctorId);
  formData.append('hospital_id', hospitalId);

  try {
    const response = await fetch(`${API_BASE}/hospital_doctors/assign.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

    if (result.status === true) {
      loadAssignedHospitals();
    }

  } catch (error) {
    console.log(error);
    showToast('Failed to assign hospital', 'error');
  }
}

async function loadAssignedHospitals() {
  const doctorId = doctorSelect.value;

  if (!doctorId) {
    assignedHospitalCount.innerText = '0 Assigned';
    assignedHospitals.innerHTML = `
      <p class="text-muted mb-0">
        Select a doctor to view assigned hospitals.
      </p>
    `;
    return;
  }

  try {
    assignedHospitals.innerHTML = `
      <p class="text-muted mb-0">
        Loading assigned hospitals...
      </p>
    `;

    const response = await fetch(
      `${API_BASE}/hospital_doctors/list.php?doctor_id=${doctorId}`,
      {
        credentials: 'include'
      }
    );

    const result = await response.json();
    const hospitals = result.data || [];

    assignedHospitalCount.innerText = `${hospitals.length} Assigned`;

    if (hospitals.length === 0) {
      assignedHospitals.innerHTML = `
        <p class="text-muted mb-0">
          No hospitals assigned.
        </p>
      `;
      return;
    }

    assignedHospitals.innerHTML = '';

    hospitals.forEach((item) => {
      assignedHospitals.innerHTML += `
        <div class="border rounded p-3 mb-3">
          <h6 class="font-weight-bold text-primary mb-2">
            ${item.hospital_name || item.name || 'Hospital'}
          </h6>

          <p class="mb-1">
            <strong>City:</strong> ${item.city || '-'}
          </p>

          <p class="mb-0">
            <strong>State:</strong> ${item.state || '-'}
          </p>

          <button
            class="btn btn-danger btn-sm mt-2"
            onclick="removeHospital(${item.id})"
          >
            Remove
          </button>

        </div>
      `;
    });

  } catch (error) {
    console.log(error);
    assignedHospitalCount.innerText = '0 Assigned';

    assignedHospitals.innerHTML = `
      <p class="text-danger mb-0">
        Failed to load assigned hospitals.
      </p>
    `;
  }
}

doctorSelect.addEventListener('change', loadAssignedHospitals);

loadDoctors();
loadHospitals();

async function removeHospital(hospitalId) {
  const doctorId = doctorSelect.value;

  if (!doctorId || !hospitalId) {
    showToast('Invalid doctor or hospital', 'error');
    return;
  }

  const formData = new FormData();

  formData.append('doctor_id', doctorId);
  formData.append('hospital_id', hospitalId);

  try {
    const response = await fetch(`${API_BASE}/hospital_doctors/remove.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

    if (result.status === true) {
      loadAssignedHospitals();
    }

  } catch (error) {
    console.log(error);
    showToast('Failed to remove hospital', 'error');
  }
}

async function loadAllDoctorHospitalLinks() {
  try {
    const response = await fetch(`${API_BASE}/hospital_doctors/all.php`);
    const result = await response.json();

    const links = result.data || [];

    if (links.length === 0) {
      allDoctorHospitalLinks.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">
            No doctor-hospital links found.
          </td>
        </tr>
      `;
      return;
    }

    allDoctorHospitalLinks.innerHTML = '';

    links.forEach((link) => {
      allDoctorHospitalLinks.innerHTML += `
        <tr>
          <td>${link.doctor_name || '-'}</td>
          <td>${link.qualification || '-'}</td>
          <td>${link.hospital_name || '-'}</td>
          <td>${link.hospital_type || '-'}</td>
          <td>${link.city || '-'}</td>
          <td>${link.state || '-'}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    allDoctorHospitalLinks.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          Failed to load doctor-hospital links.
        </td>
      </tr>
    `;
  }
}

loadAllDoctorHospitalLinks();
async function loadPendingHospitalRequests() {
  try {
    const response = await fetch(`${API_BASE}/admin/hospital_requests.php`);
    const result = await response.json();

    const requests = result.data || [];

    pendingRequestCount.innerText = `${requests.length} Pending`;

    if (requests.length === 0) {
      pendingHospitalRequests.innerHTML = `
        <p class="text-muted mb-0">
          No pending hospital requests.
        </p>
      `;
      return;
    }

    pendingHospitalRequests.innerHTML = '';

    requests.forEach((request) => {
      pendingHospitalRequests.innerHTML += `
        <div class="border rounded p-3 mb-3">

          <h6 class="font-weight-bold text-primary mb-2">
            ${request.doctor_name}
          </h6>

          <p class="mb-1">
            <strong>Email:</strong> ${request.doctor_email}
          </p>

          <p class="mb-1">
            <strong>Phone:</strong> ${request.doctor_phone}
          </p>

          <hr>

          <p class="mb-1">
            <strong>Hospital:</strong> ${request.hospital_name}
          </p>

          <p class="mb-3">
            <strong>Location:</strong> ${request.city || '-'}, ${request.state || '-'}
          </p>

          <button
            class="btn btn-success btn-sm"
            onclick="approveHospitalRequest(${request.request_id})"
          >
            Approve
          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="rejectHospitalRequest(${request.request_id})"
          >
            Reject
          </button>

        </div>
      `;
    });

  } catch (error) {
    console.log(error);

    pendingHospitalRequests.innerHTML = `
      <p class="text-danger mb-0">
        Failed to load pending requests.
      </p>
    `;
  }
}

async function approveHospitalRequest(requestId) {
  const formData = new FormData();
  formData.append('request_id', requestId);

  const response = await fetch(`${API_BASE}/admin/approve_hospital_request.php`, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  loadPendingHospitalRequests();
  loadAllDoctorHospitalLinks();

  if (doctorSelect.value) {
    loadAssignedHospitals();
  }
}

async function rejectHospitalRequest(requestId) {
  const formData = new FormData();
  formData.append('request_id', requestId);

  const response = await fetch(`${API_BASE}/admin/reject_hospital_request.php`, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  loadPendingHospitalRequests();
  loadAllDoctorHospitalLinks();

  if (doctorSelect.value) {
    loadAssignedHospitals();
  }
}

loadPendingHospitalRequests();