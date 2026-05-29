async function loadPendingDoctors() {
  const table = document.getElementById('pendingDoctorsTable');
  const countBadge = document.getElementById('pendingDoctorsCount');

  table.innerHTML = `
    <tr>
      <td colspan="7" class="text-center">
        Loading pending doctors...
      </td>
    </tr>
  `;

  try {
    const response = await fetch(`${API_BASE}/doctors/pending_list.php`, { 
      credentials: 'include'
    });

    const result = await response.json();

    if (result.status === false) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">
            ${result.message || 'Unable to load pending doctors'}
          </td>
        </tr>
      `;
      return;
    }

    const doctors = result.data || [];

    countBadge.innerText = `${doctors.length} Pending`;


    if (doctors.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            No pending doctors found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    doctors.forEach((doctor) => {
      table.innerHTML += `
        <tr>
          <td>
            <strong>${doctor.name}</strong><br>
            <small class="text-muted">ID: ${doctor.id}</small>
          </td>

          <td>${doctor.email}</td>
          <td>${doctor.phone}</td>
          <td>${doctor.qualification || '-'}</td>
          <td>₹${doctor.consulting_fee || 0}</td>

          <td>
            <span class="badge badge-warning">Pending</span>
          </td>

          <td>
            <button class="btn btn-success btn-sm"
                    onclick="approveDoctor(${doctor.id})">
              Approve
            </button>

            <button class="btn btn-danger btn-sm ml-1"
                    onclick="rejectDoctor(${doctor.id})">
              Reject
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    table.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Failed to load pending doctors.
        </td>
      </tr>
    `;
  }
}

async function approveDoctor(id) {
  const formData = new FormData();
  formData.append('id', id);

  const response = await fetch(`${API_BASE}/doctors/approve.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

showToast(
  result.status === true
    ? 'Doctor approved successfully'
    : (result.message || 'Doctor approve failed'),
  result.status === true ? 'success' : 'error'
);

  if (result.status === true) {
    loadPendingDoctors();
  }
}

async function rejectDoctor(id) {
  const formData = new FormData();
  formData.append('id', id);

  const response = await fetch(`${API_BASE}/doctors/delete.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

showToast(
  result.status === true
    ? 'Doctor rejected successfully'
    : (result.message || 'Doctor reject failed'),
  result.status === true ? 'success' : 'error'
);

  if (result.status === true) {
    loadPendingDoctors();
  }
}
loadPendingDoctors();