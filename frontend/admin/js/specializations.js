let editingSpecializationId = null;

async function loadSpecializations() {
  const table = document.getElementById('specializationsTableBody');
  const countBadge = document.getElementById('totalSpecializationsCount');

  try {
    const response = await fetch(`${API_BASE}/specialization_masters/list.php`, {
      credentials: 'include'
    });

    const result = await response.json();
    const specializations = result.data || [];

    countBadge.innerText = `${specializations.length} Specializations`;

    if (specializations.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No specializations found.</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    specializations.forEach((specialization) => {
      const isActive = Number(specialization.status) === 1;

      const statusBadge = isActive
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const safeName = specialization.name.replace(/'/g, "\\'");

      const actionButton = isActive
        ? `
          <button class="btn btn-warning btn-sm mr-1" onclick="openEditSpecialization(${specialization.id}, '${safeName}')">
            Edit
          </button>

          <button class="btn btn-danger btn-sm" onclick="deactivateSpecialization(${specialization.id})">
            Deactivate
          </button>
        `
        : `<button class="btn btn-success btn-sm" onclick="restoreSpecialization('${safeName}')">Activate</button>`;

      table.innerHTML += `
        <tr>
          <td>${specialization.id}</td>
          <td>${specialization.name}</td>
          <td>${statusBadge}</td>
          <td>${specialization.created_at || '-'}</td>
          <td>${actionButton}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          Failed to load specializations.
        </td>
      </tr>
    `;
  }
}

function openSpecializationForm() {
  editingSpecializationId = null;

  document.querySelector('#specializationModal .modal-title').innerText =
    'Add New Specialization';

  document.querySelector('#specializationForm button[type="submit"]').innerText =
    'Save Specialization';

  document.getElementById('specializationName').value = '';

  $('#specializationModal').modal('show');
}

function openEditSpecialization(id, name) {
  editingSpecializationId = id;

  document.querySelector('#specializationModal .modal-title').innerText =
    'Edit Specialization';

  document.querySelector('#specializationForm button[type="submit"]').innerText =
    'Update Specialization';

  document.getElementById('specializationName').value = name;

  $('#specializationModal').modal('show');
}

async function deactivateSpecialization(id) {
  const formData = new FormData();
  formData.append('id', id);

  const response = await fetch(`${API_BASE}/specialization_masters/remove.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadSpecializations();
  }
}

async function restoreSpecialization(name) {
  const formData = new FormData();
  formData.append('name', name);

  const response = await fetch(`${API_BASE}/specialization_masters/create.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadSpecializations();
  }
}

const specializationForm = document.getElementById('specializationForm');

specializationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const specializationName =
    document.getElementById('specializationName').value.trim();

  if (!specializationName) {
    showToast('Please enter specialization name', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('name', specializationName);

  let apiUrl = `${API_BASE}/specialization_masters/create.php`;

  if (editingSpecializationId) {
    formData.append('id', editingSpecializationId);
    apiUrl = `${API_BASE}/specialization_masters/update.php`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    $('#specializationModal').modal('hide');
    editingSpecializationId = null;
    loadSpecializations();
  }
});

loadSpecializations();