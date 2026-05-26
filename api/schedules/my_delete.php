<?php

require_once "../../includes/cors.php";
require_once "../../includes/doctor_auth.php";
require_once "../../includes/response.php";
require_once "../../config/db.php";

$doctor_id = $_SESSION['doctor_id'];
$id = $_POST['id'] ?? '';

if(empty($id)) {
    error("Schedule ID is required");
    exit;
}

$query = "
UPDATE hospital_doctor_schedules hds
INNER JOIN hospital_doctors hd
ON hds.hospital_doctor_id = hd.id
SET hds.status = 0,
    hds.updated_at = NOW()
WHERE hds.id = ?
AND hd.doctor_id = ?
";

$stmt = $conn->prepare($query);

$isDeleted = $stmt->execute([$id, $doctor_id]);

if($isDeleted) {
    success("Schedule deleted successfully");
} else {
    error("Schedule delete failed");
}