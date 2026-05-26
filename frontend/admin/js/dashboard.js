async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats.php`, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (!data.status) {
      console.log(data.message);
      return;
    }

    const d = data.data;

    document.getElementById("totalDoctors").innerText = d.total_doctors;
    document.getElementById("pendingDoctors").innerText = d.pending_doctors;
    document.getElementById("totalHospitals").innerText = d.total_hospitals;
    document.getElementById("totalReviews").innerText = d.total_reviews;
    document.getElementById("pendingReviews").innerText = d.pending_reviews;
    document.getElementById("topPendingDoctors").innerText = d.pending_doctors;
    document.getElementById("topPendingReviews").innerText = d.pending_reviews;

  } catch (err) {
    console.log("Dashboard error:", err);
  }
}

loadDashboardStats();

async function loadDoctorHospitalCount() {

  try {

    const response = await fetch(
      `${API_BASE}/hospital_doctors/count.php`
    );

    const result = await response.json();

    document.getElementById(
      'doctorHospitalCount'
    ).innerText = result.data.total;

  } catch(error) {

    console.log(error);
  }
}

loadDoctorHospitalCount();