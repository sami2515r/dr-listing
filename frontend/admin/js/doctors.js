async function loadDoctors() {
  const table = document.getElementById('doctorsTableBody');
  const countBadge = document.getElementById('totalDoctorsCount');

  table.innerHTML = `
    <tr>
      <td colspan="7" class="text-center">
        Loading doctors...
      </td>
    </tr>
  `;

  try {
const response = await fetch(`${API_BASE}/doctors/admin_list.php`, {
  credentials: 'include'
});

    const result = await response.json();

    if (result.status === false) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">
            ${result.message || 'Unable to load doctors'}
          </td>
        </tr>
      `;
      return;
    }

    const doctors = result.data || [];

    countBadge.innerText = `${doctors.length} Doctors`;

    if (doctors.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            No doctors found.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    doctors.forEach((doctor) => {
const statusNumber =
  doctor.status !== undefined && doctor.status !== null
    ? Number(doctor.status)
    : 1;

let statusBadge =
  `<span class="badge badge-success">Active</span>`;

if (statusNumber === 0) {

  statusBadge =
    `<span class="badge badge-warning">Pending</span>`;
}

if (statusNumber === 2) {

  statusBadge =
    `<span class="badge badge-danger">Deleted</span>`;
}



      table.innerHTML += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img
                src="${
                  doctor.profile_image_url
                    ? doctor.profile_image_url
                    : 'http://localhost/dr_listing/uploads/doctors/default.png'
                }"
                style="width:40px;height:40px;border-radius:50%;object-fit:cover;margin-right:10px;"
              >
              <div>
                <strong>${doctor.name}</strong>
                <br>
                <small class="text-muted">ID: ${doctor.id}</small>
              </div>
            </div>
          </td>

          <td>${doctor.email}</td>
          <td>${doctor.phone}</td>
          <td>
  <strong>${doctor.qualification || '-'}</strong><br>
  <small class="text-muted">
    ${doctor.specialization_name || 'General Physician'}
  </small>
</td>
          <td>₹${doctor.consulting_fee || 0}</td>

          <td>${statusBadge}</td>
<td>

  ${
    statusNumber !== 2
      ? `
        <button
          class="btn btn-warning btn-sm mr-1"
          onclick='openEditDoctor(${JSON.stringify(doctor)})'
        >
          Edit
        </button>

        <button
          class="btn btn-danger btn-sm mr-1"
          onclick="deleteDoctor(${doctor.id})"
        >
          Delete
        </button>
      `
      : `
        <button
          class="btn btn-success btn-sm mr-1"
          onclick="restoreDoctor(${doctor.id})"
        >
          Restore
        </button>
      `
  }

  <button
    class="btn btn-info btn-sm"
    onclick="viewDoctor(${doctor.id})"
  >
    View
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
          Failed to load doctors.
        </td>
      </tr>
    `;
  }
}

loadDoctors();

function viewDoctor(id) {
  window.open(`../doctor-details.html?id=${id}`, '_blank');
}
async function loadDoctorFormOptions() {

  const degreeSelect =
    document.getElementById('doctorQualification');

  const specializationSelect =
    document.getElementById('doctorSpecialization');

  if (!degreeSelect || !specializationSelect) return;

  degreeSelect.innerHTML = `
    <option value="">Select Degree</option>
  `;

  specializationSelect.innerHTML = `
    <option value="">Select Specialization</option>
  `;

  const degreeResponse = await fetch(
    `${API_BASE}/degree_masters/list.php`
  );

  const degreeResult = await degreeResponse.json();

  const degrees = degreeResult.data || [];

  degrees
    .filter((degree) => Number(degree.status) === 1)
    .forEach((degree) => {

      degreeSelect.innerHTML += `
        <option value="${degree.name}">
          ${degree.name}
        </option>
      `;
    });

  const specializationResponse = await fetch(
    `${API_BASE}/specialization_masters/list.php`
  );

  const specializationResult =
    await specializationResponse.json();

  const specializations =
    specializationResult.data || [];

  specializations
    .filter((item) => Number(item.status) === 1)
    .forEach((item) => {

      specializationSelect.innerHTML += `
        <option value="${item.name}">
          ${item.name}
        </option>
      `;
    });
}

function openAddDoctorModal() {

  document.getElementById('addDoctorForm').reset();

  loadDoctorFormOptions();

  $('#addDoctorModal').modal('show');
}

const addDoctorForm =
  document.getElementById('addDoctorForm');

if (addDoctorForm) {

  addDoctorForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'name',
      document.getElementById('doctorName').value
    );

    formData.append(
      'email',
      document.getElementById('doctorEmail').value
    );

    formData.append(
      'password',
      document.getElementById('doctorPassword').value
    );

    formData.append(
      'phone',
      document.getElementById('doctorPhone').value
    );

    formData.append(
      'qualification',
      document.getElementById('doctorQualification').value
    );

    formData.append(
      'specialization',
      document.getElementById('doctorSpecialization').value
    );

    formData.append(
      'consulting_fee',
      document.getElementById('doctorFee').value
    );

    formData.append(
      'availability_status',
      document.getElementById('doctorAvailability').value
    );

    formData.append(
      'description',
      document.getElementById('doctorDescription').value
    );

    const imageFile =
      document.getElementById('doctorProfileImage').files[0];

    if (imageFile) {

      formData.append(
        'profile_image',
        imageFile
      );
    }

    try {

      const response = await fetch(

        `${API_BASE}/doctors/create.php`,

        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      );

      const result = await response.json();

      showToast(
        result.message,
        result.status === true ? 'success' : 'error'
      );

      if (result.status === true) {

        $('#addDoctorModal').modal('hide');

        loadDoctors();
      }

    } catch (error) {

      console.log(error);

      showToast(
        'Doctor creation failed',
        'error'
      );
    }
  });
}

async function openEditDoctor(doctor) {

  await loadDoctorFormOptions();

  const modal = document.createElement('div');

  modal.id = 'editDoctorModal';

  modal.innerHTML = `

    <div class="modal fade show"
         style="display:block;background:rgba(0,0,0,0.5);">

      <div class="modal-dialog modal-lg">

        <div class="modal-content">

          <form id="editDoctorForm">

            <div class="modal-header">

              <h5 class="modal-title">
                Edit Doctor
              </h5>

              <button
                type="button"
                class="close"
                onclick="closeEditDoctorModal()"
              >
                <span>&times;</span>
              </button>

            </div>

            <div class="modal-body">

              <input
                type="hidden"
                id="editDoctorId"
                value="${doctor.id}"
              >

              <div class="row">

                <div class="col-md-6 mb-3">
                  <label>Name</label>

                  <input
                    type="text"
                    id="editDoctorName"
                    class="form-control"
                    value="${doctor.name || ''}"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label>Email</label>

                  <input
                    type="email"
                    id="editDoctorEmail"
                    class="form-control"
                    value="${doctor.email || ''}"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label>Phone</label>

                  <input
                    type="text"
                    id="editDoctorPhone"
                    class="form-control"
                    value="${doctor.phone || ''}"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label>Qualification</label>

                  <select
                    id="editDoctorQualification"
                    class="form-control"
                  ></select>
                </div>

                <div class="col-md-6 mb-3">
                  <label>Specialization</label>

                  <select
                    id="editDoctorSpecialization"
                    class="form-control"
                  ></select>
                </div>

                <div class="col-md-6 mb-3">
                  <label>Consulting Fee</label>

                  <input
                    type="number"
                    id="editDoctorFee"
                    class="form-control"
                    value="${doctor.consulting_fee || ''}"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label>Availability</label>

                  <select
                    id="editDoctorAvailability"
                    class="form-control"
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Busy">
                      Busy
                    </option>

                    <option value="On Leave">
                      On Leave
                    </option>

                  </select>
                </div>

                <div class="col-md-12 mb-3">

                  <label>Description</label>

                  <textarea
                    id="editDoctorDescription"
                    class="form-control"
                  >${doctor.description || ''}</textarea>

                </div>

                <div class="col-md-12 mb-3">

                  <label>Profile Image</label>

                  <input
                    type="file"
                    id="editDoctorProfileImage"
                    class="form-control"
                    accept="image/*"
                  >

                </div>

              </div>

            </div>

            <div class="modal-footer">

              <button
                type="button"
                class="btn btn-secondary"
                onclick="closeEditDoctorModal()"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="btn btn-primary"
              >
                Update Doctor
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('editDoctorQualification').innerHTML =
    document.getElementById('doctorQualification').innerHTML;

  document.getElementById('editDoctorSpecialization').innerHTML =
    document.getElementById('doctorSpecialization').innerHTML;

  document.getElementById('editDoctorQualification').value =
    doctor.qualification || '';

  document.getElementById('editDoctorSpecialization').value =
    doctor.specialization_name || '';

  document.getElementById('editDoctorAvailability').value =
    doctor.availability_status || 'Available';

  document
    .getElementById('editDoctorForm')
    .addEventListener('submit', updateDoctorByAdmin);
}

function closeEditDoctorModal() {

  const modal =
    document.getElementById('editDoctorModal');

  if(modal) {
    modal.remove();
  }
}

async function updateDoctorByAdmin(e) {

  e.preventDefault();

  const formData = new FormData();

  formData.append(
    'id',
    document.getElementById('editDoctorId').value
  );

  formData.append(
    'name',
    document.getElementById('editDoctorName').value
  );

  formData.append(
    'email',
    document.getElementById('editDoctorEmail').value
  );

  formData.append(
    'phone',
    document.getElementById('editDoctorPhone').value
  );

  formData.append(
    'qualification',
    document.getElementById('editDoctorQualification').value
  );

  formData.append(
    'specialization',
    document.getElementById('editDoctorSpecialization').value
  );

  formData.append(
    'consulting_fee',
    document.getElementById('editDoctorFee').value
  );

  formData.append(
    'availability_status',
    document.getElementById('editDoctorAvailability').value
  );

  formData.append(
    'description',
    document.getElementById('editDoctorDescription').value
  );

  const imageFile =
    document.getElementById('editDoctorProfileImage').files[0];

  if(imageFile) {

    formData.append(
      'profile_image',
      imageFile
    );
  }

  const response = await fetch(

    `${API_BASE}/doctors/admin_update.php`,

    {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }
  );

  const result = await response.json();

  showToast(
    result.message,
    result.status === true ? 'success' : 'error'
  );

  if(result.status === true) {

    closeEditDoctorModal();

    loadDoctors();
  }
}

async function deleteDoctor(id) {

  const confirmDelete = confirm(
    'Are you sure you want to delete this doctor?'
  );

  if(!confirmDelete) return;

  const formData = new FormData();

  formData.append('id', id);

  try {

    const response = await fetch(

      `${API_BASE}/doctors/delete.php`,

      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    );

    const result = await response.json();

    showToast(
      result.message,
      result.status === true ? 'success' : 'error'
    );

    if(result.status === true) {

      loadDoctors();
    }

  } catch(error) {

    console.log(error);

    showToast(
      'Doctor delete failed',
      'error'
    );
  }
}
async function restoreDoctor(id) {

  const formData = new FormData();

  formData.append('id', id);

  formData.append('status', 1);

  try {

    const response = await fetch(

      `${API_BASE}/doctors/status.php`,

      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    );

    const result = await response.json();

    showToast(
      result.message,
      result.status === true ? 'success' : 'error'
    );

    if(result.status === true) {

      loadDoctors();
    }

  } catch(error) {

    console.log(error);

    showToast(
      'Doctor restore failed',
      'error'
    );
  }
}