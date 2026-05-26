<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_GET['doctor_id'] ?? '';

if (empty($doctor_id)) {
    error("Doctor ID is required");
    exit;
}

$query = "
SELECT
    hd.id,
    hd.status AS request_status,
    h.id AS hospital_id,
    h.name,
    h.hospital_type,
    h.phone,
    h.description,
    ha.addresses_line1,
    ha.addresses_line2,
    ha.city,
    ha.state,
    ha.country,
    ha.pincode
FROM hospital_doctors hd
INNER JOIN hospitals h ON h.id = hd.hospital_id
LEFT JOIN hospital_addresses ha ON ha.hospital_id = h.id
WHERE hd.doctor_id = ?
ORDER BY hd.id DESC
";

$stmt = $conn->prepare($query);
$stmt->execute([$doctor_id]);

success("Doctor hospitals fetched successfully", $stmt->fetchAll(PDO::FETCH_ASSOC));