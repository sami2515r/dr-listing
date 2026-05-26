<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$query = "
SELECT
    hds.id,
    hds.hospital_doctor_id,
    hds.day_of_week,
    hds.start_time,
    hds.end_time,
    hds.status,

    d.name AS doctor_name,
    h.name AS hospital_name

FROM hospital_doctor_schedules hds

INNER JOIN hospital_doctors hd
ON hds.hospital_doctor_id = hd.id

INNER JOIN doctors d
ON hd.doctor_id = d.id

INNER JOIN hospitals h
ON hd.hospital_id = h.id

WHERE hds.status = 1
AND hd.status = 1
AND d.status = 1
AND h.status = 1

ORDER BY d.name ASC, h.name ASC, hds.day_of_week ASC
";

$stmt = $conn->prepare($query);
$stmt->execute();

$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Schedules fetched successfully", $schedules);