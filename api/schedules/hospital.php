<?php

require_once "../../includes/cors.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_id = $_GET['hospital_id'] ?? '';

if(empty($hospital_id)) {
    error("Hospital ID is required");
    exit;
}

$query = "
SELECT
    hds.day_of_week,
    hds.start_time,
    hds.end_time,
    hd.doctor_id

FROM hospital_doctor_schedules hds

INNER JOIN hospital_doctors hd
ON hds.hospital_doctor_id = hd.id

WHERE hd.hospital_id = ?
AND hds.status = 1
AND hd.status = 1

ORDER BY
    hd.doctor_id ASC,
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
$stmt->execute([$hospital_id]);

$schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

success("Hospital schedules fetched successfully", $schedules);