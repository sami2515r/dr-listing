let allHospitals = [];

async function loadHospitals(search = ''){
  const container = document.getElementById('hospitalList');

  try {
    const response = await fetch(`${API_BASE}/hospitals/list.php?search=${search}`);
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

<p class="hospital-owner">
  ${
    hospital.created_by_doctor_name
      ? `Managed by Dr. ${hospital.created_by_doctor_name}`
      : 'Managed by MedFinder'
  }
</p>

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
  const value = searchInput.value.toLowerCase().trim();

  const filtered = allHospitals.filter((hospital) => {
    const searchableText = `
      ${hospital.id || ''}
      ${hospital.name || ''}
      ${hospital.hospital_type || ''}
      ${hospital.phone || ''}
      ${hospital.description || ''}
      ${hospital.addresses_line1 || ''}
      ${hospital.addresses_line2 || ''}
      ${hospital.city || ''}
      ${hospital.state || ''}
      ${hospital.country || ''}
      ${hospital.pincode || ''}
      ${hospital.latitude || ''}
      ${hospital.longitude || ''}
    `.toLowerCase();

    return searchableText.includes(value);
  });

  renderHospitals(filtered);
}

loadHospitals();

const hospitalSearch = document.getElementById('hospitalSearch');
const hospitalSearchBtn = document.getElementById('hospitalSearchBtn');
const hospitalClearBtn = document.getElementById('hospitalClearBtn');

hospitalSearchBtn.addEventListener('click', () => {
  loadHospitals(hospitalSearch.value);
});

hospitalClearBtn.addEventListener('click', () => {
  hospitalSearch.value = '';
  loadHospitals();
});