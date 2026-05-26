<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    hd.id AS request_id,
    d.name AS doctor_name,
    d.email AS doctor_email,
    d.phone AS doctor_phone,
    h.name AS hospital_name,
    ha.city,
    ha.state
FROM hospital_doctors hd
INNER JOIN doctors d ON d.id = hd.doctor_id
INNER JOIN hospitals h ON h.id = hd.hospital_id
LEFT JOIN hospital_addresses ha ON ha.hospital_id = h.id
WHERE hd.status = 0
ORDER BY hd.id DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();

success("Hospital requests fetched successfully", $stmt->fetchAll(PDO::FETCH_ASSOC));