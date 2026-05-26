<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

/*
|--------------------------------------------------------------------------
| GET HOSPITAL ID
|--------------------------------------------------------------------------
*/

$hospital_id = $_GET['hospital_id'] ?? '';

if (empty($hospital_id)) {
    error("Hospital ID is required");
    exit;
}

/*
|--------------------------------------------------------------------------
| GET DOCTORS ASSIGNED TO HOSPITAL
|--------------------------------------------------------------------------
*/

$query = "
SELECT
    doctors.id,
    doctors.name,
    doctors.email,
    doctors.phone,
    doctors.profile_image,
    doctors.description,
    doctors.qualification,
    doctors.consulting_fee,
    doctors.availability_status,

    specialization_masters.name AS specialization_name,

    COALESCE(AVG(reviews.rating), 0) AS average_rating,
    COUNT(reviews.id) AS total_reviews

FROM hospital_doctors

INNER JOIN doctors
    ON doctors.id = hospital_doctors.doctor_id
    AND doctors.status = 1

LEFT JOIN doctor_specializations
    ON doctor_specializations.doctor_id = doctors.id
    AND doctor_specializations.status = 1

LEFT JOIN specialization_masters
    ON specialization_masters.id = doctor_specializations.specialization_id

LEFT JOIN reviews
    ON reviews.doctor_id = doctors.id
    AND reviews.is_approved = 1
    AND reviews.status = 1

WHERE hospital_doctors.hospital_id = ?
AND hospital_doctors.status = 1

GROUP BY doctors.id

ORDER BY average_rating DESC, total_reviews DESC, doctors.id DESC
";

$stmt = $conn->prepare($query);

$stmt->execute([$hospital_id]);

$doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

/*
|--------------------------------------------------------------------------
| ADD PROFILE IMAGE URL
|--------------------------------------------------------------------------
*/

foreach ($doctors as &$doctor) {

    $doctor['profile_image_url'] =

    !empty($doctor['profile_image'])

    ? "http://localhost/dr_listing/uploads/doctors/" . $doctor['profile_image']

    : null;
}

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

success("Doctors fetched successfully", $doctors);