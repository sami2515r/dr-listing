async function loadHomeStats() {
  try {
    const [doctorsRes, hospitalsRes] = await Promise.all([
      fetch(`${API_BASE}/doctors/list.php`),
      fetch(`${API_BASE}/hospitals/list.php`)
    ]);

    const doctorsData = await doctorsRes.json();
    const hospitalsData = await hospitalsRes.json();

    const doctors = doctorsData.data || [];
    const hospitals = hospitalsData.data || [];

    document.getElementById('homeDoctorCount').innerText = `${doctors.length}+`;
    document.getElementById('homeHospitalCount').innerText = `${hospitals.length}+`;

  } catch (error) {
    console.log(error);
  }
}

function homeSearch() {
  const value = document.getElementById('homeSearchInput').value.trim();

  if (!value) {
    window.location.href = 'doctors.html';
    return;
  }

  window.location.href = `doctors.html?search=${encodeURIComponent(value)}`;
}

loadHomeStats();