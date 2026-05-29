<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

/*
|--------------------------------------------------------------------------
| FETCH ALL HOSPITALS
|--------------------------------------------------------------------------
*/

$search = $_GET['search'] ?? '';

$query = "

SELECT

    h.id,
    h.name,
    h.hospital_type,
    h.phone,
    h.description,
    d.name AS created_by_doctor_name,

    ha.addresses_line1,
    ha.addresses_line2,
    ha.city,
    ha.state,
    ha.country,
    ha.pincode,
    ha.latitude,
    ha.longitude


FROM hospitals h

LEFT JOIN doctors d
ON d.id = h.created_by_doctor_id

LEFT JOIN hospital_addresses ha
ON h.id = ha.hospital_id

WHERE h.status = 1
AND (
    h.name LIKE :search
    OR h.hospital_type LIKE :search
    OR h.phone LIKE :search
    OR h.description LIKE :search

    OR ha.addresses_line1 LIKE :search
    OR ha.addresses_line2 LIKE :search

    OR ha.city LIKE :search
    OR ha.state LIKE :search
    OR ha.country LIKE :search
    OR ha.pincode LIKE :search

    OR ha.latitude LIKE :search
    OR ha.longitude LIKE :search
)

ORDER BY h.id DESC
";

$stmt = $conn->prepare($query);

$stmt->execute([
    ':search' => '%' . $search . '%'
]);

$hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);

/*
|--------------------------------------------------------------------------
| RESPONSE
|--------------------------------------------------------------------------
*/

success("Hospitals fetched successfully", $hospitals);