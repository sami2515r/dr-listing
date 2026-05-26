<?php

require_once "../../includes/cors.php";
require_once "../../includes/admin_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$hospital_doctor_id = $_POST['hospital_doctor_id'] ?? '';

/*
|--------------------------------------------------------------------------
| GET SCHEDULE ID
|--------------------------------------------------------------------------
*/

$id = $_POST['id'] ?? '';

if(empty($id)) {

    error("Schedule ID is required");
    exit;
}
if(empty($hospital_doctor_id)) {

    error("Hospital Doctor ID is required");
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
| DELETE SCHEDULE
|--------------------------------------------------------------------------
*/

$deleteQuery = "
UPDATE hospital_doctor_schedules
SET
    status = 0,
    updated_at = NOW()
WHERE id = ?
AND hospital_doctor_id = ?
";

$deleteStmt = $conn->prepare($deleteQuery);

$isDeleted = $deleteStmt->execute([

    $id,
    $hospital_doctor_id
]);

if($isDeleted) {

    success("Schedule deleted successfully");

} else {

    error("Schedule deletion failed");
}