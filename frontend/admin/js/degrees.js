let editingDegreeId = null;

async function loadDegrees() {
  const table = document.getElementById('degreesTableBody');
  const countBadge = document.getElementById('totalDegreesCount');

  try {
    const response = await fetch(`${API_BASE}/degree_masters/list.php`, {
      credentials: 'include'
    });

    const result = await response.json();
    const degrees = result.data || [];

    countBadge.innerText = `${degrees.length} Degrees`;

    if (degrees.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No degrees found.</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = '';

    degrees.forEach((degree) => {
      const isActive = Number(degree.status) === 1;

      const statusBadge = isActive
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const actionButton = isActive
        ? `
          <button class="btn btn-warning btn-sm mr-1" onclick="openEditDegree(${degree.id}, '${degree.name.replace(/'/g, "\\'")}')">
            Edit
          </button>

          <button class="btn btn-danger btn-sm" onclick="deactivateDegree(${degree.id})">
            Deactivate
          </button>
        `
        : `<button class="btn btn-success btn-sm" onclick="restoreDegree('${degree.name.replace(/'/g, "\\'")}')">Activate</button>`;

      table.innerHTML += `
        <tr>
          <td>${degree.id}</td>
          <td>${degree.name}</td>
          <td>${statusBadge}</td>
          <td>${degree.created_at || '-'}</td>
          <td>${actionButton}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          Failed to load degrees.
        </td>
      </tr>
    `;
  }
}

function openDegreeForm() {
  editingDegreeId = null;

  document.querySelector('#degreeModal .modal-title').innerText = 'Add New Degree';
  document.querySelector('#degreeForm button[type="submit"]').innerText = 'Save Degree';

  document.getElementById('degreeName').value = '';
  $('#degreeModal').modal('show');
}

function openEditDegree(id, name) {
  editingDegreeId = id;

  document.querySelector('#degreeModal .modal-title').innerText = 'Edit Degree';
  document.querySelector('#degreeForm button[type="submit"]').innerText = 'Update Degree';

  document.getElementById('degreeName').value = name;
  $('#degreeModal').modal('show');
}

async function deactivateDegree(id) {
  const formData = new FormData();
  formData.append('id', id);

  const response = await fetch(`${API_BASE}/degree_masters/remove.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadDegrees();
  }
}

async function restoreDegree(name) {
  const formData = new FormData();
  formData.append('name', name);

  const response = await fetch(`${API_BASE}/degree_masters/create.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadDegrees();
  }
}

const degreeForm = document.getElementById('degreeForm');

degreeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const degreeName = document.getElementById('degreeName').value.trim();

  if (!degreeName) {
    showToast('Please enter degree name', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('name', degreeName);

  let apiUrl = `${API_BASE}/degree_masters/create.php`;

  if (editingDegreeId) {
    formData.append('id', editingDegreeId);
    apiUrl = `${API_BASE}/degree_masters/update.php`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    $('#degreeModal').modal('hide');
    editingDegreeId = null;
    loadDegrees();
  }
});

loadDegrees();