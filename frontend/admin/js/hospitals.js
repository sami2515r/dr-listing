let allHospitals = [];

async function loadHospitals() {
  const table = document.getElementById('hospitalsTableBody');
  const countBadge = document.getElementById('totalHospitalsCount');

  try {
    const response = await fetch(`${API_BASE}/hospitals/list.php`, {
      credentials: 'include'
    });

    const result = await response.json();
    allHospitals = result.data || [];

    countBadge.innerText = `${allHospitals.length} Hospitals`;

    if (allHospitals.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="11" class="text-center">
            No hospitals found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    allHospitals.forEach((hospital) => {
      table.innerHTML += `
        <tr>
          <td>${hospital.id}</td>

          <td>
            <strong>${hospital.name}</strong><br>
            <small>${hospital.description || '-'}</small>
          </td>

          <td>${hospital.hospital_type || '-'}</td>
          <td>${hospital.phone || '-'}</td>

          <td>
            ${hospital.addresses_line1 || '-'}
            ${hospital.addresses_line2 || ''}
          </td>

          <td>${hospital.city || '-'}</td>
          <td>${hospital.state || '-'}</td>
          <td>${hospital.country || '-'}</td>
          <td>${hospital.pincode || '-'}</td>

          <td>
            ${hospital.latitude || '-'}, ${hospital.longitude || '-'}
          </td>

          <td>
            <button
              class="btn btn-warning btn-sm"
              onclick="openEditHospital(${hospital.id})"
            >
              Edit
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    table.innerHTML = `
      <tr>
        <td colspan="11" class="text-center text-danger">
          Failed to load hospitals.
        </td>
      </tr>
    `;
  }
}

function openEditHospital(id) {
  const hospital = allHospitals.find((item) => item.id == id);

  if (!hospital) {
    showToast('Hospital not found', 'error');
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'hospitalEditModal';

  modal.innerHTML = `
    <div class="modal fade show" style="display:block; background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Edit Hospital</h5>
            <button type="button" class="close" onclick="closeHospitalModal()">
              <span>&times;</span>
            </button>
          </div>

          <form id="editHospitalForm">
            <div class="modal-body">

              <input type="hidden" id="editHospitalId" value="${hospital.id}">

              <div class="row">

                <div class="col-md-6 mb-3">
                  <label>Name</label>
                  <input type="text" id="editHospitalName" class="form-control" value="${hospital.name || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Hospital Type</label>
                  <input type="text" id="editHospitalType" class="form-control" value="${hospital.hospital_type || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Phone</label>
                  <input type="text" id="editHospitalPhone" class="form-control" value="${hospital.phone || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>City</label>
                  <input type="text" id="editHospitalCity" class="form-control" value="${hospital.city || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>State</label>
                  <input type="text" id="editHospitalState" class="form-control" value="${hospital.state || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Country</label>
                  <input type="text" id="editHospitalCountry" class="form-control" value="${hospital.country || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Pincode</label>
                  <input type="text" id="editHospitalPincode" class="form-control" value="${hospital.pincode || ''}">
                </div>

                <div class="col-md-3 mb-3">
                  <label>Latitude</label>
                  <input type="text" id="editHospitalLatitude" class="form-control" value="${hospital.latitude || ''}">
                </div>

                <div class="col-md-3 mb-3">
                  <label>Longitude</label>
                  <input type="text" id="editHospitalLongitude" class="form-control" value="${hospital.longitude || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Address Line 1</label>
                  <input type="text" id="editHospitalAddress1" class="form-control" value="${hospital.addresses_line1 || ''}">
                </div>

                <div class="col-md-6 mb-3">
                  <label>Address Line 2</label>
                  <input type="text" id="editHospitalAddress2" class="form-control" value="${hospital.addresses_line2 || ''}">
                </div>

                <div class="col-md-12 mb-3">
                  <label>Description</label>
                  <textarea id="editHospitalDescription" class="form-control">${hospital.description || ''}</textarea>
                </div>

              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="closeHospitalModal()">
                Cancel
              </button>

              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById('editHospitalForm')
    .addEventListener('submit', updateHospital);
}

function closeHospitalModal() {
  const modal = document.getElementById('hospitalEditModal');

  if (modal) {
    modal.remove();
  }
}

async function updateHospital(event) {
  event.preventDefault();

  const formData = new FormData();

  formData.append('id', document.getElementById('editHospitalId').value);
  formData.append('name', document.getElementById('editHospitalName').value);
  formData.append('hospital_type', document.getElementById('editHospitalType').value);
  formData.append('phone', document.getElementById('editHospitalPhone').value);
  formData.append('description', document.getElementById('editHospitalDescription').value);

  formData.append('address_line1', document.getElementById('editHospitalAddress1').value);
  formData.append('address_line2', document.getElementById('editHospitalAddress2').value);
  formData.append('city', document.getElementById('editHospitalCity').value);
  formData.append('state', document.getElementById('editHospitalState').value);
  formData.append('country', document.getElementById('editHospitalCountry').value);
  formData.append('pincode', document.getElementById('editHospitalPincode').value);
  formData.append('latitude', document.getElementById('editHospitalLatitude').value);
  formData.append('longitude', document.getElementById('editHospitalLongitude').value);

  try {
    const response = await fetch(`${API_BASE}/hospitals/update.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

    if (result.status === true) {
      closeHospitalModal();
      loadHospitals();
    }

  } catch (error) {
    console.log(error);
    showToast('Hospital update failed', 'error');
  }
}

loadHospitals();

function openAddHospitalModal() {
  document.getElementById('addHospitalForm').reset();
  document.getElementById('hospitalCountry').value = 'India';
  $('#addHospitalModal').modal('show');
}

const addHospitalForm = document.getElementById('addHospitalForm');

if (addHospitalForm) {
  addHospitalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', document.getElementById('hospitalName').value);
    formData.append('hospital_type', document.getElementById('hospitalType').value);
    formData.append('phone', document.getElementById('hospitalPhone').value);
    formData.append('description', document.getElementById('hospitalDescription').value);

    formData.append('address_line1', document.getElementById('hospitalAddress1').value);
    formData.append('address_line2', document.getElementById('hospitalAddress2').value);
    formData.append('city', document.getElementById('hospitalCity').value);
    formData.append('state', document.getElementById('hospitalState').value);
    formData.append('country', document.getElementById('hospitalCountry').value);
    formData.append('pincode', document.getElementById('hospitalPincode').value);
    formData.append('latitude', document.getElementById('hospitalLatitude').value);
    formData.append('longitude', document.getElementById('hospitalLongitude').value);

    const response = await fetch(`${API_BASE}/hospitals/create.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

    if (result.status === true) {
      $('#addHospitalModal').modal('hide');
      loadHospitals();
    }
  });
}