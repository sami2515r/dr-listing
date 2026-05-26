<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    reviews.id,
    reviews.doctor_id,
    reviews.patient_name,
    reviews.patient_email,
    reviews.review_title,
    reviews.rating,
    reviews.review_text,
    reviews.is_approved,
    reviews.status,
    reviews.created_at,
    doctors.name AS doctor_name
FROM reviews
LEFT JOIN doctors
    ON doctors.id = reviews.doctor_id
WHERE reviews.status = 1
ORDER BY reviews.created_at DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();

$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

success('Reviews fetched successfully', $reviews);