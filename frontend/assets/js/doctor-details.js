const params = new URLSearchParams(window.location.search);
const doctorId = params.get('id');
const doctorHospitals = document.getElementById('doctorHospitals');

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

async function loadDoctor() {

  const response = await fetch(`${API_BASE}/doctors/single.php?id=${doctorId}`);

  const data = await response.json();

  const doctor = data.data || data;

  const container = document.getElementById('doctorProfile');

  container.innerHTML = `

    <div class="doctor-profile-card">

      <div class="doctor-profile-image">
<img
  src="${
    doctor.profile_image_url
      ? doctor.profile_image_url
      : 'http://localhost/dr_listing/uploads/doctors/default.png'
  }"
>
      </div>

      <div class="doctor-profile-content">

        <h1>${doctor.name}</h1>

        <span class="doctor-degree">
          ${doctor.qualification}
        </span>

       <p>
  ${doctor.description || 'Experienced doctor'}
</p>

<div class="profile-rating">

  <p class="rating-title">
    Ratings & Reviews
  </p>

  <div class="rating-row">

    ${generateStars(doctor.average_rating)}

    <span class="rating-value">
      ${Number(doctor.average_rating || 0).toFixed(1)}
      (${doctor.total_reviews || 0} Reviews)
    </span>

  </div>

</div>  

<div class="doctor-info-grid">

          <div class="info-box">
            <h3>Consulting Fee</h3>
            <p>₹${doctor.consulting_fee}</p>
          </div>

          <div class="info-box">
            <h3>Availability</h3>
            <p>${doctor.availability_status || 'Available'}</p>
          </div>
<div class="info-box">
  <h3>Specialization</h3>

  <p>
    ${doctor.specialization_name || 'General Physician'}
  </p>
</div>

<div class="info-box">
  <h3>Qualification</h3>

  <p>
    ${doctor.qualification || '-'}
  </p>
</div>

          <div class="info-box">
            <h3>Phone</h3>
            <p>${doctor.phone}</p>
          </div>

          <div class="info-box">
            <h3>Email</h3>
            <p>${doctor.email}</p>
          </div>

        </div>

      </div>

    </div>
  `;
loadDoctorHospitals(doctorId);
loadDoctorSchedules(doctorId);

}

async function loadReviews() {

  try {

    const response = await fetch(`${API_BASE}/reviews/list.php?doctor_id=${doctorId}`);

    const data = await response.json();

    const reviews = data.data || data;

    const reviewsContainer = document.getElementById('reviewsContainer');

    reviewsContainer.innerHTML = '';

    if (reviews.length === 0) {
  reviewsContainer.innerHTML = `
    <div class="empty-state">
      No approved reviews yet.
    </div>
  `;
  return;
}

    reviews.forEach((review) => {

     reviewsContainer.innerHTML += `

  <div class="review-card">

    <h3>
      ${review.review_title}
    </h3>

    <strong>
      ${review.patient_name}
    </strong>

<div class="review-rating">
  ${generateStars(review.rating)}
  <span>${review.rating}</span>
</div>

    <p>
      ${review.review_text}
    </p>

  </div>
`;

    });

  } catch(error) {
    console.log(error);
  }
}

async function loadDoctorHospitals(doctorId) {

  try {

    const response = await fetch(
      `${API_BASE}/hospital_doctors/list.php?doctor_id=${doctorId}`
    );

    const result = await response.json();

    const hospitals = result.data || [];

    if (hospitals.length === 0) {

      doctorHospitals.innerHTML = `
        <div class="empty-state">
          No hospitals assigned yet.
        </div>
      `;

      return;
    }

    doctorHospitals.innerHTML = '';

    hospitals.forEach((hospital) => {

doctorHospitals.innerHTML += `
  <div class="hospital-card">

    <div class="hospital-card-content">

      <h3>
        ${hospital.hospital_name || hospital.name}
      </h3>

      <p class="hospital-location">
        ${hospital.city || '-'},
        ${hospital.state || '-'}
      </p>

      <div class="hospital-phone">
        📞 ${hospital.phone || 'Not Available'}
      </div>

    </div>

  </div>
`;
    });

  } catch(error) {

    console.log(error);

    doctorHospitals.innerHTML = `
      <div class="empty-state">
        Failed to load hospitals.
      </div>
    `;
  }
}

loadDoctor();
loadReviews();

const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('doctor_id', doctorId);
    formData.append('patient_name', document.getElementById('patientName').value);
    formData.append('patient_email', document.getElementById('patientEmail').value);
    formData.append('rating', document.getElementById('rating').value);
    formData.append('review_title', document.getElementById('reviewTitle').value);
    formData.append('review_text', document.getElementById('reviewText').value);

    try {
      const response = await fetch(`${API_BASE}/reviews/create.php`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === true) {
        showToast('Review submitted. It will appear after admin approval.', 'success');
        reviewForm.reset();
      } else {
        showToast(data.message || 'Review submission failed', 'error');
      }

    } catch (error) {
      console.log(error);
      showToast('Server error while submitting review', 'error');
    }
  });
}

async function loadDoctorSchedules(doctorId) {

  const container =
    document.getElementById('doctorSchedules');

  if(!container) return;

  try {

    const response = await fetch(
      `${API_BASE}/schedules/doctor.php?doctor_id=${doctorId}`
    );

    const result = await response.json();

    const schedules = result.data || [];

    if(schedules.length === 0) {

      container.innerHTML = `
        <div class="empty-state">
          No schedules available.
        </div>
      `;

      return;
    }

    container.innerHTML = '';

    schedules.forEach((schedule) => {

      container.innerHTML += `

        <div class="schedule-card">

          <h4>
            ${schedule.hospital_name}
          </h4>

<div class="schedule-day">
  ${schedule.day_of_week}
</div>

<div class="schedule-time">
  🕒 ${schedule.start_time} - ${schedule.end_time}
</div>

        </div>
      `;
    });

  } catch(error) {

    console.log(error);
  }
}

