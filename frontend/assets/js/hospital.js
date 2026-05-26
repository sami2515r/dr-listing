let allHospitals = [];

async function loadHospitals() {
  const container = document.getElementById('hospitalList');

  try {
    const response = await fetch(`${API_BASE}/hospitals/list.php`);
    const data = await response.json();

    allHospitals = data.data || [];

    renderHospitals(allHospitals);

  } catch (error) {
    console.log(error);
    container.innerHTML = `<div class="empty-state">Failed to load hospitals.</div>`;
  }
}

function renderHospitals(hospitals) {
  const container = document.getElementById('hospitalList');

  if (hospitals.length === 0) {
    container.innerHTML = `<div class="empty-state">No hospitals found.</div>`;
    return;
  }

  container.innerHTML = '';

  hospitals.forEach((hospital) => {
container.innerHTML += `
  <div class="hospital-card">

    <span class="hospital-type">
      ${hospital.hospital_type || 'General Hospital'}
    </span>

    <h3>${hospital.name}</h3>

    <p>
      ${hospital.description || 'Trusted healthcare provider'}
    </p>

    <div class="hospital-meta">

      <p>
        <strong>Phone:</strong>
        ${hospital.phone || '-'}
      </p>

      <p>
        <strong>City:</strong>
        ${hospital.city || '-'}, ${hospital.state || '-'}
      </p>

      <p>
        <strong>Address:</strong>
        ${hospital.addresses_line1 || ''}
        ${hospital.addresses_line2 || ''}
      </p>

    </div>

    <a
      href="hospital-details.html?id=${hospital.id}"
      class="view-btn"
    >
      View Hospital
    </a>

  </div>
`;
  });
}

function filterHospitals() {
  const searchInput = document.getElementById('hospitalSearch');
  const value = searchInput.value.toLowerCase();

  const filtered = allHospitals.filter((hospital) => {
    return (
      (hospital.name || '').toLowerCase().includes(value) ||
      (hospital.city || '').toLowerCase().includes(value) ||
      (hospital.state || '').toLowerCase().includes(value) ||
      (hospital.hospital_type || '').toLowerCase().includes(value) ||
      (hospital.description || '').toLowerCase().includes(value)
    );
  });

  renderHospitals(filtered);
}

loadHospitals();