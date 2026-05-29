function generateStars(rating) {
  rating = Number(rating || 0);

  const percentage = (rating / 5) * 100;

  return `
    <div class="star-rating">
      <div class="stars-back">★★★★★</div>
      <div class="stars-front" style="width:${percentage}%">★★★★★</div>
    </div>
  `;
}

const doctorGrid = document.getElementById('doctorGrid');
let allDoctors = [];

async function loadDoctors() {
  try {
    doctorGrid.innerHTML = `
      <div class="loader">
        Loading Doctors...
      </div>
    `;

    const response = await fetch(`${API_BASE}/doctors/list.php`);
    const data = await response.json();

    allDoctors = data.data || data;

renderDoctors(allDoctors);
loadFilterOptions();
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');

    if (searchQuery) {
      document.getElementById('doctorSearch').value = searchQuery;
      filterDoctors();

      setTimeout(() => {
        doctorGrid.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }

  } catch (error) {
    console.log(error);

    doctorGrid.innerHTML = `
      <div class="empty-state">
        Failed to load doctors.
      </div>
    `;
  }
}

function renderDoctors(doctors) {
  doctorGrid.innerHTML = '';

  if (!doctors || doctors.length === 0) {
    doctorGrid.innerHTML = `
      <div class="empty-state">
        No Doctors Found
      </div>
    `;
    return;
  }

  doctors.forEach((doctor) => {
    doctorGrid.innerHTML += `
      <div class="doctor-card">

        <img
          src="${
            doctor.profile_image_url
  ? doctor.profile_image_url
  : doctor.profile_image
    ? 'http://localhost/dr_listing/uploads/doctors/' + doctor.profile_image
    : 'http://localhost/dr_listing/uploads/doctors/default.png'
          }"
        >

        <div class="doctor-content">

          <div class="doctor-header">

            <h3>${doctor.name}</h3>

            <div class="doctor-status ${doctor.availability_status?.toLowerCase()}">
              ${doctor.availability_status || 'Available'}
            </div>

          </div>

          <p class="doctor-specialization">
            ${doctor.specialization_name || 'General Physician'}
          </p>

          <p>${doctor.qualification || ''}</p>

          <div class="doctor-fee">
            ₹${doctor.consulting_fee || 0} Consultation Fee
          </div>

          <div class="doctor-rating">
            ${generateStars(doctor.average_rating)}

            <span class="rating-count">
              ${Number(doctor.average_rating || 0).toFixed(1)}
              (${doctor.total_reviews || 0} Reviews)
            </span>
          </div>

          <a
            href="doctor-details.html?id=${doctor.id}"
            class="view-btn"
          >
            View Profile
          </a>

        </div>

      </div>
    `;
  });
}

function filterDoctors() {
  const searchValue = document
    .getElementById('doctorSearch')
    .value
    .toLowerCase()
    .trim();

  const availabilityValue = document
    .getElementById('availabilityFilter')
    .value
    .toLowerCase();

  const specializationValue = document
    .getElementById('specializationFilter')
    .value
    .toLowerCase();

  const locationValue = document
    .getElementById('cityFilter')
    .value
    .toLowerCase();

  const filteredDoctors = allDoctors.filter((doctor) => {
    const specializationText = `
      ${doctor.specialization_name || ''}
      ${doctor.specialization_search || ''}
    `.toLowerCase();

    const locationText = `
      ${doctor.hospital_names || ''}
      ${doctor.city || ''}
      ${doctor.state || ''}
      ${doctor.country || ''}
      ${doctor.pincode || ''}
      ${doctor.location_search || ''}
    `.toLowerCase();

    const searchableText = `
      ${doctor.name || ''}
      ${doctor.email || ''}
      ${doctor.phone || ''}
      ${doctor.qualification || ''}
      ${doctor.description || ''}
      ${specializationText}
      ${locationText}
      ${doctor.availability_status || ''}

    `.toLowerCase();

    return (
      (
  searchValue === '' ||
  (/^\d+$/.test(searchValue)
    ? Number(doctor.consulting_fee) === Number(searchValue)
    : searchableText.includes(searchValue)
  )
) &&
      (availabilityValue === '' ||
        (doctor.availability_status || '').toLowerCase() === availabilityValue) &&
      (specializationValue === '' ||
        specializationText.includes(specializationValue)) &&
      (locationValue === '' ||
        locationText.includes(locationValue))
    );
  });

  renderDoctors(filteredDoctors);
}

function clearDoctorFilters() {
  document.getElementById('doctorSearch').value = '';
  document.getElementById('specializationFilter').value = '';
  document.getElementById('cityFilter').value = '';
  document.getElementById('availabilityFilter').value = '';

  renderDoctors(allDoctors);
}




async function loadFilterOptions() {
const specializationSelect = document.getElementById('specializationFilter');
const citySelect = document.getElementById('cityFilter');
const availabilitySelect = document.getElementById('availabilityFilter');

if (!specializationSelect || !citySelect || !availabilitySelect) return;

specializationSelect.innerHTML = `<option value="">All Specializations</option>`;
citySelect.innerHTML = `<option value="">All Locations</option>`;
availabilitySelect.innerHTML = `<option value="">All Status</option>`;

  try {
    const response = await fetch(`${API_BASE}/specializations/all.php`);
    const result = await response.json();

    const specializations = result.data || result || [];

    specializations.forEach((specialization) => {
      specializationSelect.innerHTML += `
        <option value="${specialization.name}">
          ${specialization.name}
        </option>
      `;
    });
  } catch (error) {
    console.log('Specialization loading failed', error);
  }

  const cities = [
    ...new Set(
      allDoctors
        .flatMap((doctor) => [
          ...(doctor.city || '').split(','),
          ...(doctor.state || '').split(','),
          ...(doctor.pincode || '').split(',')
        ])
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ];

  cities.forEach((city) => {
    citySelect.innerHTML += `
      <option value="${city}">
        ${city}
      </option>
    `;
  });

  const statuses = [
  ...new Set(
    allDoctors
      .map((doctor) => doctor.availability_status)
      .filter(Boolean)
  )
];

statuses.forEach((status) => {
  availabilitySelect.innerHTML += `
    <option value="${status}">
      ${status}
    </option>
  `;
});
$('.chosen-select').trigger('chosen:updated');
}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('doctorSearch');

  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        filterDoctors();
      }
    });
  }
});

loadDoctors();

function initChosenSelects() {
  if (typeof $ !== 'undefined' && $.fn.chosen) {
    $('.chosen-select').chosen({
      width: '100%',
      no_results_text: 'No results found'
    });
  }
}

document.addEventListener('DOMContentLoaded', initChosenSelects);