<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_GET['doctor_id'] ?? '';

if (empty($doctor_id)) {
    error("Doctor ID is required");
    exit;
}

/*
|--------------------------------------------------------------------------
| Existing doctor-hospital requests / approved / rejected
|--------------------------------------------------------------------------
*/

$query = "
SELECT
    hd.id AS request_id,
    hd.status AS request_status,

    h.id,
    h.name,
    h.hospital_type,
    h.phone,
    h.description,

    ha.addresses_line1,
    ha.addresses_line2,
    ha.city,
    ha.state,
    ha.country,
    ha.pincode,

    'link_request' AS request_type

FROM hospital_doctors hd

INNER JOIN hospitals h
ON h.id = hd.hospital_id

LEFT JOIN hospital_addresses ha
ON h.id = ha.hospital_id

WHERE hd.doctor_id = ?
";

$stmt = $conn->prepare($query);
$stmt->execute([$doctor_id]);

$linkRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);

/*
|--------------------------------------------------------------------------
| Hospitals added by doctor and waiting for admin approval
|--------------------------------------------------------------------------
*/

$hospitalQuery = "
SELECT
    h.id AS request_id,
    h.status AS request_status,

    h.id,
    h.name,
    h.hospital_type,
    h.phone,
    h.description,

    ha.addresses_line1,
    ha.addresses_line2,
    ha.city,
    ha.state,
    ha.country,
    ha.pincode,

    'hospital_add_request' AS request_type

FROM hospitals h

LEFT JOIN hospital_addresses ha
ON h.id = ha.hospital_id

WHERE h.created_by_doctor_id = ?
AND h.status IN (0, 2)
";

$hospitalStmt = $conn->prepare($hospitalQuery);
$hospitalStmt->execute([$doctor_id]);

$hospitalAddRequests = $hospitalStmt->fetchAll(PDO::FETCH_ASSOC);

$finalData = array_merge($linkRequests, $hospitalAddRequests);

success("Doctor hospitals fetched successfully", $finalData);