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
async function loadDoctors() {
  try {
    const response = await fetch(`${API_BASE}/doctors/list.php`);
    const data = await response.json();

    const doctorGrid = document.getElementById('doctorGrid');

    let doctors = data.data || data;

    const topDoctors = [...doctors]
      .sort((a, b) => {
        return Number(b.average_rating || b.average_status || 0) -
               Number(a.average_rating || a.average_status || 0);
      })
      .slice(0, 3);

    doctorGrid.innerHTML = '';

    topDoctors.forEach((doctor) => {
      doctorGrid.innerHTML += `
        <div class="doctor-card">

          <img
            src="${
              doctor.profile_image_url
                ? doctor.profile_image_url
                : 'http://localhost/dr_listing/uploads/doctors/default.png'
            }"
          >

          <div class="doctor-content">
            <h3>${doctor.name}</h3>
            <p>${doctor.qualification || ''}</p>
            <p>${doctor.description || 'Experienced Specialist'}</p>



<div class="doctor-meta">
  <span>₹${doctor.consulting_fee || 0}</span>

  <span>
    ${doctor.availability_status || 'Available'}
  </span>
</div>

<div class="doctor-rating">
  ${generateStars(doctor.average_rating)}

  <span class="rating-count">
    ${Number(doctor.average_rating || 0).toFixed(1)}
    (${doctor.total_reviews || 0} Reviews)
  </span>
</div>
            <a href="doctor-details.html?id=${doctor.id}">
              View Profile
            </a>
          </div>

        </div>
      `;
    });

  } catch (error) {
    console.log(error);
  }
}

loadDoctors();