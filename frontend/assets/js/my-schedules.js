const currentUser =
  JSON.parse(localStorage.getItem('doctor_user'));

if (!currentUser) {
  window.location.href = 'login.html';
}

const mappingSelect =
  document.getElementById('myHospitalDoctorSelect');

const scheduleList =
  document.getElementById('mySchedulesList');

async function loadMyMappings() {
  const response = await fetch(`${API_BASE}/schedules/my_mappings.php`, {
    credentials: 'include'
  });

  const result = await response.json();

  const mappings = result.data || [];

  mappingSelect.innerHTML = `
    <option value="">Select Hospital</option>
  `;

  if (mappings.length === 0) {
    mappingSelect.innerHTML = `
      <option value="">No assigned hospitals</option>
    `;
    return;
  }

  mappings.forEach((item) => {
    mappingSelect.innerHTML += `
      <option value="${item.id}">
        ${item.hospital_name}
      </option>
    `;
  });
}

async function loadMySchedules() {
  scheduleList.innerHTML = `
    <div class="empty-state">
      Loading schedules...
    </div>
  `;

  const response = await fetch(`${API_BASE}/schedules/my_schedules.php`, {
    credentials: 'include'
  });

  const result = await response.json();

  const schedules = result.data || [];

  if (schedules.length === 0) {
    scheduleList.innerHTML = `
      <div class="empty-state">
        No schedules added yet.
      </div>
    `;
    return;
  }

  scheduleList.innerHTML = `
    <div id="doctorSchedules"></div>
  `;

  const container = document.getElementById('doctorSchedules');

  schedules.forEach((schedule) => {
    container.innerHTML += `
      <div class="schedule-card">

        <h4>${schedule.hospital_name}</h4>

        <div class="schedule-day">
          ${schedule.day_of_week}
        </div>

        <div class="schedule-time">
          🕒 ${schedule.start_time} - ${schedule.end_time}
        </div>
<button
  class="view-btn"
  onclick="openEditMySchedule(
    ${schedule.id},
    ${schedule.hospital_doctor_id},
    '${schedule.day_of_week}',
    '${schedule.start_time}',
    '${schedule.end_time}'
  )"
>
  Edit
</button>
        <button
          class="view-btn"
          onclick="deleteMySchedule(${schedule.id})"
        >
          Delete
        </button>

      </div>
    `;
  });
}

const myScheduleForm =
  document.getElementById('myScheduleForm');

myScheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append(
    'hospital_doctor_id',
    mappingSelect.value
  );

  formData.append(
    'day_of_week',
    document.getElementById('myDayOfWeek').value
  );

  formData.append(
    'start_time',
    document.getElementById('myStartTime').value
  );

  formData.append(
    'end_time',
    document.getElementById('myEndTime').value
  );

  const response = await fetch(`${API_BASE}/schedules/my_create.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    myScheduleForm.reset();
    loadMySchedules();
  }
});

async function deleteMySchedule(id) {
  const formData = new FormData();
  formData.append('id', id);

  const response = await fetch(`${API_BASE}/schedules/my_delete.php`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();

  showToast(result.message, result.status === true ? 'success' : 'error');

  if (result.status === true) {
    loadMySchedules();
  }
}

loadMyMappings();
loadMySchedules();

function openEditMySchedule(
  id,
  hospitalDoctorId,
  day,
  start,
  end
) {
  document.getElementById('editMyScheduleId').value = id;
  document.getElementById('editMyScheduleHospitalDoctorId').value = hospitalDoctorId;
  document.getElementById('editMyScheduleDay').value = day;
  document.getElementById('editMyScheduleStart').value = start.substring(0, 5);
  document.getElementById('editMyScheduleEnd').value = end.substring(0, 5);

  document.getElementById('editMyScheduleModal').classList.add('active');
}

function closeEditMyScheduleModal() {
  document.getElementById('editMyScheduleModal').classList.remove('active');
}

const editMyScheduleForm =
  document.getElementById('editMyScheduleForm');

if(editMyScheduleForm) {
  editMyScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('id', document.getElementById('editMyScheduleId').value);
    formData.append('hospital_doctor_id', document.getElementById('editMyScheduleHospitalDoctorId').value);
    formData.append('day_of_week', document.getElementById('editMyScheduleDay').value);
    formData.append('start_time', document.getElementById('editMyScheduleStart').value);
    formData.append('end_time', document.getElementById('editMyScheduleEnd').value);

    const response = await fetch(`${API_BASE}/schedules/my_update.php`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    showToast(result.message, result.status === true ? 'success' : 'error');

    if(result.status === true) {
      closeEditMyScheduleModal();
      loadMySchedules();
    }
  });
}