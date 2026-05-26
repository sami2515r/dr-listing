const params = new URLSearchParams(window.location.search);

const id = params.get('id');

const hospitalContainer =
  document.getElementById('hospitalContainer');

const hospitalDoctors =
  document.getElementById('hospitalDoctors');

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

async function loadHospital() {

  try {

const response = await fetch(
  `${API_BASE}/hospitals/list.php`
);

const result = await response.json();

const hospitals = result.data || [];

const hospital = hospitals.find(
  h => h.id == id
);

hospitalContainer.innerHTML = `

<section class="hospital-hero">

  <div>

    <span class="hero-badge">
      ${hospital.hospital_type || 'Hospital'}
    </span>

    <h1>
      ${hospital.name}
    </h1>

    <p>
      ${hospital.description || 'Trusted healthcare provider'}
    </p>

  </div>

</section>

<section class="single-hospital-view">

  <div class="hospital-info-grid">

    <div class="info-box">
      <h3>Phone</h3>
      <p>${hospital.phone || '-'}</p>
    </div>

    <div class="info-box">
      <h3>City</h3>
      <p>${hospital.city || '-'}</p>
    </div>

    <div class="info-box">
      <h3>State</h3>
      <p>${hospital.state || '-'}</p>
    </div>

    <div class="info-box">
      <h3>Address</h3>
      <p>
        ${hospital.addresses_line1 || ''}
        ${hospital.addresses_line2 || ''}
      </p>
    </div>

  </div>

</section>
`;

    loadHospitalDoctors(id);

  } catch(error) {

    console.log(error);
  }
}

async function loadHospitalDoctors(hospitalId) {

  try {

    const response = await fetch(
      `${API_BASE}/hospital_doctors/doctors.php?hospital_id=${hospitalId}`
    );

    const result = await response.json();

    const doctors = result.data || [];
const scheduleResponse = await fetch(
  `${API_BASE}/schedules/hospital.php?hospital_id=${hospitalId}`
);

const scheduleResult = await scheduleResponse.json();

const schedules = scheduleResult.data || [];
    if(doctors.length === 0) {
 
      hospitalDoctors.innerHTML = `
        <div class="empty-state">
          No doctors assigned yet.
        </div>
      `;

      return;
    }

    hospitalDoctors.innerHTML = '';

    doctors.forEach((doctor) => {
const doctorSchedules = schedules.filter(
  (schedule) => schedule.doctor_id == doctor.id
);

let scheduleHtml = '';

if (doctorSchedules.length > 0) {

  scheduleHtml = `
    <div class="doctor-schedule-mini">

      ${doctorSchedules.map((schedule) => {

        const formattedDay =
          schedule.day_of_week.charAt(0).toUpperCase() +
          schedule.day_of_week.slice(1).toLowerCase();

        const formattedStart =
          new Date(`1970-01-01T${schedule.start_time}`)
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

        const formattedEnd =
          new Date(`1970-01-01T${schedule.end_time}`)
.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}).toUpperCase();

        return `
          <div>
            <strong>${formattedDay}</strong>
            •
            ${formattedStart} - ${formattedEnd}
          </div>
        `;
      }).join('')}

    </div>
  `;
}
      hospitalDoctors.innerHTML += `
        <div class="doctor-card">

          <img
            src="${
              doctor.profile_image
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

<p>
  ${doctor.qualification || ''}
</p>
${scheduleHtml}
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

  } catch(error) {

    console.log(error);
  }
}

loadHospital();