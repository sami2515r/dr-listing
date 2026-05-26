<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_doctor_id = $_POST['hospital_doctor_id'] ?? '';
$day_of_week = $_POST['day_of_week'] ?? '';
$start_time = $_POST['start_time'] ?? '';
$end_time = $_POST['end_time'] ?? '';

if(
    empty($hospital_doctor_id) ||
    empty($day_of_week) ||
    empty($start_time) ||
    empty($end_time)
) {

    error("All fields are required");
    exit;
}

$duplicateQuery = "
SELECT id
FROM hospital_doctor_schedules
WHERE hospital_doctor_id = ?
AND day_of_week = ?
AND start_time = ?
AND end_time = ?
AND status = 1
LIMIT 1
";

$duplicateStmt = $conn->prepare($duplicateQuery);

$duplicateStmt->execute([
    $hospital_doctor_id,
    $day_of_week,
    $start_time,
    $end_time
]);

if($duplicateStmt->fetch(PDO::FETCH_ASSOC)) {

    error("This schedule already exists");
    exit;
}

$query = "
INSERT INTO hospital_doctor_schedules
(
    hospital_doctor_id,
    day_of_week,
    start_time,
    end_time,
    status,
    created_at
)
VALUES
(
    ?, ?, ?, ?, 1, NOW()
)
";

$stmt = $conn->prepare($query);

$isInserted = $stmt->execute([

    $hospital_doctor_id,
    $day_of_week,
    $start_time,
    $end_time
]);

if($isInserted) {

    success("Schedule created successfully");

} else {

    error("Schedule creation failed");
}