<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_doctor_id = $_POST['hospital_doctor_id'] ?? '';

$id = $_POST['id'] ?? '';

$day_of_week = $_POST['day_of_week'] ?? '';
$start_time = $_POST['start_time'] ?? '';
$end_time = $_POST['end_time'] ?? '';

if(empty($id)) {

    error("Schedule ID is required");
    exit;
}
if(empty($hospital_doctor_id)) {

    error("Hospital Doctor ID is required");
    exit;
}
if(
    empty($day_of_week) ||
    empty($start_time) ||
    empty($end_time)
) {

    error("All fields are required");
    exit;
}

/*
|--------------------------------------------------------------------------
| CHECK SCHEDULE EXISTS
|--------------------------------------------------------------------------
*/

$checkQuery = "
SELECT id
FROM hospital_doctor_schedules
WHERE id = ?
AND hospital_doctor_id = ?
AND status = 1
LIMIT 1
";

$checkStmt = $conn->prepare($checkQuery);

$checkStmt->execute([

    $id,
    $hospital_doctor_id
]);

$schedule = $checkStmt->fetch(PDO::FETCH_ASSOC);

if(!$schedule) {

    error("Schedule not found");
    exit;
}

/*
|--------------------------------------------------------------------------
| UPDATE SCHEDULE
|--------------------------------------------------------------------------
*/
$duplicateQuery = "
SELECT id
FROM hospital_doctor_schedules
WHERE hospital_doctor_id = ?
AND day_of_week = ?
AND start_time = ?
AND end_time = ?
AND status = 1
AND id != ?
LIMIT 1
";

$duplicateStmt = $conn->prepare($duplicateQuery);

$duplicateStmt->execute([

    $hospital_doctor_id,
    $day_of_week,
    $start_time,
    $end_time,
    $id
]);

if($duplicateStmt->fetch(PDO::FETCH_ASSOC)) {

    error("This schedule already exists");
    exit;
}

$updateQuery = "
UPDATE hospital_doctor_schedules
SET
    day_of_week = ?,
    start_time = ?,
    end_time = ?,
    updated_at = NOW()
WHERE id = ?
AND hospital_doctor_id = ?
";

$updateStmt = $conn->prepare($updateQuery);

$isUpdated = $updateStmt->execute([

    $day_of_week,
    $start_time,
    $end_time,
    $id,
    $hospital_doctor_id
]);

if($isUpdated) {

    success("Schedule updated successfully");

} else {

    error("Schedule update failed");
}