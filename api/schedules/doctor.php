<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_GET['doctor_id'] ?? '';

if(empty($doctor_id)) {

    error("Doctor ID is required");
    exit;
}

$query = "
SELECT
    hds.id,
    hds.day_of_week,
    hds.start_time,
    hds.end_time,

    h.name AS hospital_name

FROM hospital_doctor_schedules hds

INNER JOIN hospital_doctors hd
ON hds.hospital_doctor_id = hd.id

INNER JOIN hospitals h
ON hd.hospital_id = h.id

WHERE
    hd.doctor_id = ?
AND
    hds.status = 1
AND
    hd.status = 1
AND
    h.status = 1

ORDER BY
    FIELD(
        hds.day_of_week,
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    )
";

$stmt = $conn->prepare($query);

$stmt->execute([$doctor_id]);

$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

success(
    "Schedules fetched successfully",
    $schedules
);