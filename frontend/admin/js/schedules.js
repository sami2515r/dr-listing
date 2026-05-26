async function loadHospitalDoctors() {

  const select =
    document.getElementById('hospitalDoctorSelect');

  const response = await fetch(
    `${API_BASE}/hospital_doctors/all.php`,
    {
      credentials: 'include'
    }
  );

  const result = await response.json();

  const items = result.data || [];

  select.innerHTML = `
    <option value="">
      Select Doctor Hospital
    </option>
  `;

  items.forEach((item) => {

    select.innerHTML += `
      <option value="${item.id}">
        ${item.doctor_name} - ${item.hospital_name}
      </option>
    `;
  });
}

async function loadSchedules() {

  const table =
    document.getElementById('schedulesTableBody');

  const response = await fetch(
    `${API_BASE}/schedules/all.php`,
    {
      credentials: 'include'
    }
  );

  const result = await response.json();

  const schedules = result.data || [];

  document.getElementById('scheduleCount').innerText =
  `${schedules.length} Schedules`;

  table.innerHTML = '';

  schedules.forEach((schedule) => {

    table.innerHTML += `

      <tr>

        <td>${schedule.doctor_name}</td>

        <td>${schedule.hospital_name}</td>

        <td>${schedule.day_of_week}</td>

        <td>${schedule.start_time}</td>

        <td>${schedule.end_time}</td>

<td>

  <button
    class="btn btn-primary btn-sm"
    onclick="editSchedule(
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
    class="btn btn-danger btn-sm"
    onclick="deleteSchedule(
      ${schedule.id},
      ${schedule.hospital_doctor_id}
    )"
  >
    Delete
  </button>

</td>

      </tr>
    `;
  });
}

document
  .getElementById('scheduleForm')
  .addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'hospital_doctor_id',
      document.getElementById('hospitalDoctorSelect').value
    );

    formData.append(
      'day_of_week',
      document.getElementById('dayOfWeek').value
    );

    formData.append(
      'start_time',
      document.getElementById('startTime').value
    );

    formData.append(
      'end_time',
      document.getElementById('endTime').value
    );

    const response = await fetch(
      `${API_BASE}/schedules/create.php`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    );

    const result = await response.json();

    showToast(
      result.message,
      result.status === true
        ? 'success'
        : 'error'
    );

    if(result.status === true) {

      document
        .getElementById('scheduleForm')
        .reset();

      loadSchedules();
    }
  });

async function deleteSchedule(
  id,
  hospitalDoctorId
) {

  const formData = new FormData();

  formData.append('id', id);

  formData.append(
    'hospital_doctor_id',
    hospitalDoctorId
  );

  const response = await fetch(
    `${API_BASE}/schedules/delete.php`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }
  );

  const result = await response.json();

  showToast(
    result.message,
    result.status === true
      ? 'success'
      : 'error'
  );

  if(result.status === true) {

    loadSchedules();
  }
}

loadHospitalDoctors();
loadSchedules();

function editSchedule(
  id,
  hospitalDoctorId,
  currentDay,
  currentStart,
  currentEnd
) {
  document.getElementById('editScheduleId').value = id;

  document.getElementById('editScheduleHospitalDoctorId').value =
    hospitalDoctorId;

  document.getElementById('editScheduleDay').value =
    currentDay;

  document.getElementById('editScheduleStart').value =
    currentStart.substring(0, 5);

  document.getElementById('editScheduleEnd').value =
    currentEnd.substring(0, 5);

  $('#editScheduleModal').modal('show');
}

const editScheduleForm =
  document.getElementById('editScheduleForm');

if(editScheduleForm) {

  editScheduleForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'id',
      document.getElementById('editScheduleId').value
    );

    formData.append(
      'hospital_doctor_id',
      document.getElementById('editScheduleHospitalDoctorId').value
    );

    formData.append(
      'day_of_week',
      document.getElementById('editScheduleDay').value
    );

    formData.append(
      'start_time',
      document.getElementById('editScheduleStart').value
    );

    formData.append(
      'end_time',
      document.getElementById('editScheduleEnd').value
    );

    const response = await fetch(
      `${API_BASE}/schedules/update.php`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    );

    const result = await response.json();

    showToast(
      result.message,
      result.status === true
        ? 'success'
        : 'error'
    );

    if(result.status === true) {

      $('#editScheduleModal').modal('hide');

      loadSchedules();
    }
  });
}