<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

/*
|--------------------------------------------------------------------------
| GET DOCTOR ID
|--------------------------------------------------------------------------
*/

$id = $_GET['id'] ?? '';

if(empty($id)) {

    error("Doctor ID is required");
}

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCTOR
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
    doctors.created_at,

    specialization_masters.name AS specialization_name,

    COALESCE(AVG(reviews.rating), 0) AS average_rating,
    COUNT(reviews.id) AS total_reviews

FROM doctors

LEFT JOIN doctor_specializations
    ON doctor_specializations.doctor_id = doctors.id
    AND doctor_specializations.status = 1

LEFT JOIN specialization_masters
    ON specialization_masters.id = doctor_specializations.specialization_id

LEFT JOIN reviews
    ON reviews.doctor_id = doctors.id
    AND reviews.is_approved = 1
    AND reviews.status = 1

WHERE doctors.id = ?
AND doctors.status = 1

GROUP BY doctors.id

LIMIT 1
";

$stmt = $conn->prepare($query);

$stmt->execute([$id]);

$doctor = $stmt->fetch(PDO::FETCH_ASSOC);

/*
|--------------------------------------------------------------------------
| CHECK DOCTOR EXISTS
|--------------------------------------------------------------------------
*/

if(!$doctor) {

    error("Doctor not found");
}

/*
|--------------------------------------------------------------------------
| ADD PROFILE IMAGE URL
|--------------------------------------------------------------------------
*/

$doctor['profile_image_url'] =

!empty($doctor['profile_image'])

? "http://localhost/dr_listing/uploads/doctors/" . $doctor['profile_image']

: null;

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

success("Doctor fetched successfully", $doctor);