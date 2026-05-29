<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    h.id,
    h.name,
    h.hospital_type,
    h.phone,
    h.description,
    h.status,
    h.created_by_doctor_id,

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

WHERE h.status IN (0, 1, 2)

ORDER BY h.id DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();

success("Hospitals fetched successfully", $stmt->fetchAll(PDO::FETCH_ASSOC));